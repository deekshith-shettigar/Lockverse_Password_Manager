const { MongoClient } = require('mongodb');

let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }

    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    cachedClient = client;
    return client;
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, password } = req.body || {};
        
        if (!name || !email || !password) {
            return res.status(400).send({ success: false, message: 'name, email and password are required' });
        }

        const client = await connectToDatabase();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('signup_page_details');
        
        const emailTrimmed = String(email).trim();
        const existing = await collection.findOne({ email: emailTrimmed });
        
        if (existing) {
            return res.status(409).send({ success: false, message: 'Email already registered' });
        }

        const doc = { name, email: emailTrimmed, password, createdAt: new Date() };
        const result = await collection.insertOne(doc);
        
        return res.send({ success: true, result });
    } catch (e) {
        console.error('Signup error', e);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};
