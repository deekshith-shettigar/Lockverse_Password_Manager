const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

dotenv.config()

const VAULT_KEY = Buffer.from(process.env.VAULT_SECRET, 'hex')

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

// ─── API Key middleware ────────────────────────────────────────────────────────
const checkApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key']
    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: 'Forbidden' })
    }
    next()
}

const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();

const dbName = process.env.DB_NAME
const app = express()
const port = 3000

app.use(bodyparser.json())
app.use(cors())

// Get all the passwords (protected by API key)
app.get('/', checkApiKey, async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    const decrypted = findResult.map(entry => {
        try {
            return { ...entry, password: decryptVaultPassword(entry.password) }
        } catch (_) {
            return entry
        }
    })
    res.json(decrypted)
})

// Save a password (protected by API key)
app.post('/', checkApiKey, async (req, res) => {
    const { password, ...rest } = req.body
    const encryptedPassword = encryptVaultPassword(password)
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne({ ...rest, password: encryptedPassword });
    res.send({ success: true, result: findResult })
})

// Delete a password (protected by API key)
app.delete('/', checkApiKey, async (req, res) => {
    const { id } = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const result = await collection.deleteOne({ id: id });
    res.send({ success: true, result });
});

// Login
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
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).send({ success: false, message: 'Enter correct password' })
        }
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

// Signup
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
        const hashedPassword = await bcrypt.hash(password, 12)
        const doc = { name, email: emailTrimmed, password: hashedPassword, createdAt: new Date() }
        const result = await collection.insertOne(doc)
        res.send({ success: true, result })
    } catch (e) {
        console.error('Signup error', e)
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// Forgot password
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