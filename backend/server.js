const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')

const VAULT_KEY = Buffer.from(process.env.VAULT_SECRET, 'hex')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

function encryptVaultPassword(plainText) {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', VAULT_KEY, iv)
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()])
    return iv.toString('base64') + ':' + encrypted.toString('base64')
}

function decryptVaultPassword(stored) {
    const [ivB64, encB64] = stored.split(':')
    const iv = Buffer.from(ivB64, 'base64')
    const encrypted = Buffer.from(encB64, 'base64')
    const decipher = crypto.createDecipheriv('aes-256-cbc', VAULT_KEY, iv)
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
    return decrypted.toString('utf8')
}

// ─── Rate limiters ────────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' }
})

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many OTP requests. Please try again in 15 minutes.' }
})

// ─── OTP helpers ──────────────────────────────────────────────────────────────
const OTP_EXPIRY_MS = 10 * 60 * 1000
const OTP_RATE_LIMIT_MS = 60 * 1000

async function ensureOtpIndex() {
    const col = client.db(dbName).collection('otps')
    await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'ttl_expires' })
}

async function ensureEmailVerificationIndex() {
    const col = client.db(dbName).collection('email_verifications')
    await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'ttl_email_verify' })
}

async function setOtp(email, record) {
    const col = client.db(dbName).collection('otps')
    await col.replaceOne(
        { email },
        { email, ...record, expiresAt: new Date(record.expiresAt) },
        { upsert: true }
    )
}

async function getOtp(email) {
    const col = client.db(dbName).collection('otps')
    return col.findOne({ email })
}

async function deleteOtp(email) {
    const col = client.db(dbName).collection('otps')
    await col.deleteOne({ email })
}

// ─── JWT middleware ───────────────────────────────────────────────────────────
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null
    if (!token) {
        return res.status(401).json({ error: 'No token provided' })
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (e) {
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}

const url = process.env.MONGO_URI;
const client = new MongoClient(url);

const dbName = process.env.DB_NAME
const app = express()
const port = process.env.PORT || 3000

app.use(bodyparser.json())
app.use(cors())

// ─── Password vault routes ────────────────────────────────────────────────────

app.get('/', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.find({ userEmail }).toArray();
        const decrypted = findResult.map(entry => {
            try {
                return { ...entry, password: decryptVaultPassword(entry.password) }
            } catch (_) {
                return entry
            }
        })
        res.json(decrypted)
    } catch (e) {
        console.error('GET / error', e)
        res.status(500).json({ error: 'Server error' })
    }
})

app.post('/', verifyToken, async (req, res) => {
    try {
        const { password, ...rest } = req.body
        const userEmail = req.user.email
        const encryptedPassword = encryptVaultPassword(password)
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.insertOne({ ...rest, userEmail, password: encryptedPassword });
        res.send({ success: true, result: findResult })
    } catch (e) {
        console.error('POST / error', e)
        res.status(500).json({ error: 'Server error' })
    }
})

app.delete('/', verifyToken, async (req, res) => {
    try {
        const { id } = req.body;
        const userEmail = req.user.email
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const result = await collection.deleteOne({ id, userEmail });
        res.send({ success: true, result });
    } catch (e) {
        console.error('DELETE / error', e)
        res.status(500).json({ error: 'Server error' })
    }
});

// ─── Auth routes ──────────────────────────────────────────────────────────────

app.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body || {}
        if (!email || !password) {
            return res.status(400).send({ success: false, message: 'Email and password are required' })
        }
        const db = client.db(dbName);
        const collection = db.collection('signup_page_details');
        const emailTrimmed = String(email).trim().toLowerCase()
        const user = await collection.findOne({ email: emailTrimmed })
        const GENERIC = 'Incorrect email or password'
        if (!user) {
            return res.status(401).send({ success: false, message: GENERIC })
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).send({ success: false, message: GENERIC })
        }
        if (user.emailVerified === false) {
            return res.status(403).send({ success: false, message: 'Please verify your email before logging in. Check your inbox for the verification link.' })
        }
        if (user.emailVerified === undefined) {
            await collection.updateOne({ email: emailTrimmed }, { $set: { emailVerified: true } })
        }
        const token = jwt.sign(
            { email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        res.send({ success: true, token, user: { name: user.name, email: user.email } })
    } catch (e) {
        console.error('Login error', e)
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body || {}
        if (!name || !email || !password) {
            return res.status(400).send({ success: false, message: 'name, email and password are required' })
        }
        const db = client.db(dbName)
        const users = db.collection('signup_page_details')
        const emailTrimmed = String(email).trim().toLowerCase()

        const existing = await users.findOne({ email: emailTrimmed })
        if (existing && existing.emailVerified) {
            return res.status(409).send({ success: false, message: 'Email already registered' })
        }
        if (existing && !existing.emailVerified) {
            await users.deleteOne({ email: emailTrimmed })
        }

        const pwErrors = []
        if (password.length < 6) pwErrors.push('at least 6 characters')
        if (!/[A-Za-z]/.test(password)) pwErrors.push('at least one letter')
        if (!/[0-9]/.test(password)) pwErrors.push('at least one number')
        if (!/[^A-Za-z0-9]/.test(password)) pwErrors.push('at least one special character')
        if (pwErrors.length > 0) {
            return res.status(400).send({ success: false, message: `Password must contain: ${pwErrors.join(', ')}` })
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        await users.insertOne({
            name,
            email: emailTrimmed,
            password: hashedPassword,
            emailVerified: false,
            createdAt: new Date()
        })

        const verifyToken = crypto.randomBytes(32).toString('hex')
        const verifications = db.collection('email_verifications')
        await verifications.replaceOne(
            { email: emailTrimmed },
            { email: emailTrimmed, token: verifyToken, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
            { upsert: true }
        )

        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`

        try {
            await transporter.sendMail({
                from: `LockVerse <${process.env.EMAIL_USER}>`,
                to: emailTrimmed,
                subject: 'LockVerse – Verify your email address',
                html: `
                    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
                        <h2 style="color:#c026d3;margin-bottom:4px;">LockVerse</h2>
                        <p style="color:#374151;margin-bottom:24px;">Hi ${name}, thanks for signing up! Please verify your email address to activate your account.</p>
                        <a href="${verifyUrl}" style="display:inline-block;background:#c026d3;color:#fff;text-decoration:none;padding:12px 28px;border-radius:999px;font-weight:600;font-size:15px;">Verify Email</a>
                        <p style="color:#6b7280;margin-top:24px;font-size:13px;">This link expires in <strong>24 hours</strong>. If you didn't sign up for LockVerse, you can safely ignore this email.</p>
                        <p style="color:#9ca3af;font-size:12px;margin-top:8px;">Or copy this link: ${verifyUrl}</p>
                    </div>
                `
            })
            console.log('Verification email sent to:', emailTrimmed)
        } catch (mailErr) {
            console.error('Verification email failed to send:', mailErr.message)
            console.error('Verify URL (manual fallback):', verifyUrl)
        }

        res.send({ success: true, message: 'Account created. Please check your email to verify your account.' })
    } catch (e) {
        console.error('Signup error', e)
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// ─── Email verification ───────────────────────────────────────────────────────
app.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query
        if (!token) {
            return res.status(400).json({ success: false, message: 'Verification token is required' })
        }
        const db = client.db(dbName)
        const verifications = db.collection('email_verifications')
        const record = await verifications.findOne({ token })

        if (!record) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification link. Please sign up again.' })
        }
        if (Date.now() > new Date(record.expiresAt).getTime()) {
            await verifications.deleteOne({ token })
            return res.status(400).json({ success: false, message: 'Verification link has expired. Please sign up again.' })
        }

        const users = db.collection('signup_page_details')
        await users.updateOne({ email: record.email }, { $set: { emailVerified: true, verifiedAt: new Date() } })
        await verifications.deleteOne({ token })

        res.json({ success: true, message: 'Email verified successfully! You can now log in.' })
    } catch (e) {
        console.error('Verify email error', e)
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
})

// ─── Contact form ─────────────────────────────────────────────────────────────
app.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body || {}
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }
        await transporter.sendMail({
            from: `LockVerse <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: subject,
            html: `
                <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
                    <h2 style="color:#c026d3;margin-bottom:4px;">LockVerse — New Message</h2>
                    <p style="color:#6b7280;font-size:13px;margin-bottom:24px;">Someone sent a message via the contact form.</p>
                    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                        <tr><td style="padding:8px 0;color:#374151;font-weight:600;width:80px;">Name</td><td style="padding:8px 0;color:#111827;">${name}</td></tr>
                        <tr><td style="padding:8px 0;color:#374151;font-weight:600;">Email</td><td style="padding:8px 0;color:#111827;"><a href="mailto:${email}" style="color:#c026d3;">${email}</a></td></tr>
                        <tr><td style="padding:8px 0;color:#374151;font-weight:600;">Subject</td><td style="padding:8px 0;color:#111827;">${subject}</td></tr>
                    </table>
                    <div style="background:#f9fafb;border-left:4px solid #c026d3;padding:16px;border-radius:4px;">
                        <p style="color:#374151;margin:0;white-space:pre-wrap;">${message}</p>
                    </div>
                    <p style="color:#9ca3af;font-size:12px;margin-top:24px;">Reply directly to this email to respond to ${name}.</p>
                </div>
            `
        })
        res.json({ success: true, message: 'Message sent successfully!' })
    } catch (e) {
        console.error('Contact form error', e)
        res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' })
    }
})

// ─── OTP-based forgot password ────────────────────────────────────────────────

app.post('/forgot-password/send-otp', otpLimiter, async (req, res) => {
    try {
        const { email } = req.body || {}
        if (!email) {
            return res.status(400).send({ success: false, message: 'Email is required' })
        }
        const emailTrimmed = String(email).trim().toLowerCase()

        const db = client.db(dbName)
        const collection = db.collection('signup_page_details')
        const user = await collection.findOne({ email: emailTrimmed })

        if (user) {
            const existing = await getOtp(emailTrimmed)
            if (existing && Date.now() - existing.sentAt < OTP_RATE_LIMIT_MS) {
                const wait = Math.ceil((OTP_RATE_LIMIT_MS - (Date.now() - existing.sentAt)) / 1000)
                return res.status(429).send({ success: false, message: `Please wait ${wait}s before requesting another OTP` })
            }

            const otp = String(Math.floor(100000 + Math.random() * 900000))
            const expiresAt = Date.now() + OTP_EXPIRY_MS

            await setOtp(emailTrimmed, { otp, expiresAt, sentAt: Date.now(), verified: false })

            await transporter.sendMail({
                from: `LockVerse <${process.env.EMAIL_USER}>`,
                to: emailTrimmed,
                subject: 'LockVerse – Your Password Reset OTP',
                html: `
                    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
                        <h2 style="color:#c026d3;margin-bottom:4px;">LockVerse</h2>
                        <p style="color:#374151;margin-bottom:24px;">Your one-time password (OTP) for resetting your LockVerse account password:</p>
                        <div style="font-size:36px;font-weight:700;letter-spacing:10px;color:#1f2937;background:#f3f4f6;padding:16px 24px;border-radius:8px;text-align:center;">
                            ${otp}
                        </div>
                        <p style="color:#6b7280;margin-top:24px;font-size:14px;">This OTP expires in <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
                    </div>
                `
            })
        }

        res.send({ success: true, message: "If that email is registered, you'll receive an OTP shortly." })
    } catch (e) {
        console.error('Send OTP error', e)
        res.status(500).send({ success: false, message: 'Failed to send OTP. Please try again.' })
    }
})

app.post('/forgot-password/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body || {}
        if (!email || !otp) {
            return res.status(400).send({ success: false, message: 'Email and OTP are required' })
        }
        const emailTrimmed = String(email).trim().toLowerCase()
        const record = await getOtp(emailTrimmed)

        if (!record) {
            return res.status(400).send({ success: false, message: 'No OTP requested for this email' })
        }
        if (Date.now() > new Date(record.expiresAt).getTime()) {
            await deleteOtp(emailTrimmed)
            return res.status(400).send({ success: false, message: 'OTP has expired. Please request a new one.' })
        }
        if (String(otp).trim() !== record.otp) {
            return res.status(400).send({ success: false, message: 'Incorrect OTP. Please try again.' })
        }

        await setOtp(emailTrimmed, { ...record, verified: true, expiresAt: new Date(record.expiresAt).getTime() })

        res.send({ success: true, message: 'OTP verified' })
    } catch (e) {
        console.error('Verify OTP error', e)
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

app.post('/forgot-password', async (req, res) => {
    try {
        const { email, password } = req.body || {}
        if (!email || !password) {
            return res.status(400).send({ success: false, message: 'Email and password are required' })
        }
        const emailTrimmed = String(email).trim().toLowerCase()
        const record = await getOtp(emailTrimmed)

        if (!record || !record.verified) {
            return res.status(403).send({ success: false, message: 'OTP not verified. Please complete OTP verification first.' })
        }
        if (Date.now() > new Date(record.expiresAt).getTime()) {
            await deleteOtp(emailTrimmed)
            return res.status(400).send({ success: false, message: 'OTP session expired. Please start over.' })
        }

        const db = client.db(dbName)
        const collection = db.collection('signup_page_details')
        const user = await collection.findOne({ email: emailTrimmed })
        if (!user) {
            return res.status(404).send({ success: false, message: 'Email not found' })
        }

        const pwErrors = []
        if (password.length < 6) pwErrors.push('at least 6 characters')
        if (!/[A-Za-z]/.test(password)) pwErrors.push('at least one letter')
        if (!/[0-9]/.test(password)) pwErrors.push('at least one number')
        if (!/[^A-Za-z0-9]/.test(password)) pwErrors.push('at least one special character')
        if (pwErrors.length > 0) {
            return res.status(400).send({ success: false, message: `Password must contain: ${pwErrors.join(', ')}` })
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        await collection.updateOne(
            { email: emailTrimmed },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
        )

        await deleteOtp(emailTrimmed)

        res.send({ success: true, message: 'Password reset successfully' })
    } catch (e) {
        console.error('Reset password error', e)
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

async function start() {
    await client.connect()
    await ensureOtpIndex()
    await ensureEmailVerificationIndex()
    app.listen(port, () => {
        console.log(`LockVerse backend listening on http://localhost:${port}`)
    })
}

start().catch(err => {
    console.error('Failed to start server:', err)
    process.exit(1)
})