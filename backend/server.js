const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

dotenv.config()

// ─── AES Encryption helpers for vault passwords ───────────────────────────────
// Store VAULT_SECRET (32-char / 256-bit hex string) in your .env file
// Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
const VAULT_KEY = Buffer.from(process.env.VAULT_SECRET, 'hex') // 32 bytes → AES-256

function encryptVaultPassword(plainText) {
    const iv = crypto.randomBytes(16)                          // fresh IV every time
    const cipher = crypto.createCipheriv('aes-256-cbc', VAULT_KEY, iv)
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()])
    // store as iv:ciphertext, both base64
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

// ─── DB connection ─────────────────────────────────────────────────────────────
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();

const dbName = process.env.DB_NAME
const app = express()
const port = 3000

// Middleware
app.use(bodyparser.json())
app.use(cors())


// ─── Vault passwords ───────────────────────────────────────────────────────────

// Get all the passwords (decrypt on the way out)
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();

    // Decrypt each vault password before sending to the frontend
    const decrypted = findResult.map(entry => {
        try {
            return { ...entry, password: decryptVaultPassword(entry.password) }
        } catch (_) {
            // If decryption fails (e.g. legacy plain-text row), return as-is
            return entry
        }
    })

    res.json(decrypted)
})

// Save a password (encrypt before storing)
app.post('/', async (req, res) => {
    const { password, ...rest } = req.body
    const encryptedPassword = encryptVaultPassword(password)
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne({ ...rest, password: encryptedPassword });
    res.send({ success: true, result: findResult })
})

// Delete a password by id
app.delete('/', async (req, res) => {
    const { id } = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const result = await collection.deleteOne({ id: id });
    res.send({ success: true, result });
});


// ─── Auth endpoints ────────────────────────────────────────────────────────────

// Login — compare with bcrypt hash
app.post('/login', async (req, res) => {
    try {
        const { name, email, password } = req.body || {}
        if (!name || !email || !password) {
            return res.status(400).send({ success: false, message: 'name, email and password are required' })
        }
        const db = client.db(dbName);
        const collection = db.collection('signup_page_details');
        const emailTrimmed = String(email).trim()
        const user = await collection.findOne({ email: emailTrimmed })
        if (!user) {
            return res.status(401).send({ success: false, message: 'No account found. Please sign up.' })
        }

        // Compare submitted password against bcrypt hash
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).send({ success: false, message: 'Enter correct password' })
        }

        // Check name (case sensitive)
        const nameTrimmed = String(name).trim()
        const storedName = String(user.name).trim()
        if (nameTrimmed !== storedName) {
            return res.status(401).send({ success: false, message: 'Enter correct username' })
        }

        res.send({ success: true, user: { name: user.name, email: user.email } })
    } catch (e) {
        console.error('Login error', e)
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// Signup — hash password with bcrypt before storing
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body || {}
        if (!name || !email || !password) {
            return res.status(400).send({ success: false, message: 'name, email and password are required' })
        }
        const db = client.db(dbName);
        const collection = db.collection('signup_page_details');
        const emailTrimmed = String(email).trim()
        const existing = await collection.findOne({ email: emailTrimmed })
        if (existing) {
            return res.status(409).send({ success: false, message: 'Email already registered' })
        }

        // Hash the password with bcrypt (cost factor 12)
        const hashedPassword = await bcrypt.hash(password, 12)

        const doc = { name, email: emailTrimmed, password: hashedPassword, createdAt: new Date() }
        const result = await collection.insertOne(doc)
        res.send({ success: true, result })
    } catch (e) {
        console.error('Signup error', e)
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// Forgot password — hash new password before updating
app.post('/forgot-password', async (req, res) => {
    try {
        const { email, password } = req.body || {}
        if (!email || !password) {
            return res.status(400).send({ success: false, message: 'Email and password are required' })
        }
        const emailTrimmed = String(email).trim()
        const db = client.db(dbName);
        const collection = db.collection('signup_page_details');
        const user = await collection.findOne({ email: emailTrimmed })
        if (!user) {
            return res.status(404).send({ success: false, message: 'Email not found' })
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(password, 12)

        await collection.updateOne(
            { email: emailTrimmed },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
        )

        res.send({ success: true, message: 'Password reset successfully' })
    } catch (e) {
        console.error('Forgot password error', e)
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})


app.listen(port, () => {
    console.log(`Example app listening on  http://localhost:${port}`)
})