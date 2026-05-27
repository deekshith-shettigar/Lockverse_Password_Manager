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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const client = await connectToDatabase();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('passwords');

        if (req.method === 'GET') {
            const findResult = await collection.find({}).toArray();
            return res.json(findResult);
        }

        if (req.method === 'POST') {
            const password = req.body;
            const findResult = await collection.insertOne(password);
            return res.send({ success: true, result: findResult });
        }

        if (req.method === 'DELETE') {
            const { id } = req.body;
            const result = await collection.deleteOne({ id: id });
            return res.send({ success: true, result });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
