const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
const cors = require('cors')


dotenv.config()


// Connecting to the MongoDB Client
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();

// App & Database
const dbName = process.env.DB_NAME
const app = express()
const port = 3000

// Middleware
app.use(bodyparser.json())
app.use(cors())


// Get all the passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

// Save a password
app.post('/', async (req, res) => {
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({ success: true, result: findResult })
})

// Delete a password by id
app.delete('/', async (req, res) => {
    const { id } = req.body; // Extract UUID
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const result = await collection.deleteOne({ id: id }); // Delete where UUID matches
    res.send({ success: true, result });
});


// Login endpoint
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
            // User account not found - return generic message (not specific to email)
            return res.status(401).send({ success: false, message: 'No account found. Please sign up.' })
        }
        // Check password first (case sensitive)
        if (password !== user.password) {
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

// Save signup details to 'signup_page_details'
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
        const doc = { name, email: emailTrimmed, password, createdAt: new Date() }
        const result = await collection.insertOne(doc)
        res.send({ success: true, result })
    } catch (e) {
        console.error('Signup error', e)
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// Forgot password endpoint
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

        // Update password directly
        await collection.updateOne(
            { email: emailTrimmed },
            { $set: { password: password, updatedAt: new Date() } }
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