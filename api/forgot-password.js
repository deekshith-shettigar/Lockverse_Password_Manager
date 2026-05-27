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
        const { email, password } = req.body || {};
        
        if (!email || !password) {
            return res.status(400).send({ success: false, message: 'Email and password are required' });
        }

        const emailTrimmed = String(email).trim();
        
        const client = await connectToDatabase();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('signup_page_details');
        
        const user = await collection.findOne({ email: emailTrimmed });
        
        if (!user) {
            return res.status(404).send({ success: false, message: 'Email not found' });
        }

        await collection.updateOne(
            { email: emailTrimmed },
            { $set: { password: password, updatedAt: new Date() } }
        );

        return res.send({ success: true, message: 'Password reset successfully' });
    } catch (e) {
        console.error('Forgot password error', e);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};
