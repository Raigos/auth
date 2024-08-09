import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not defined in the environment variables');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToMongo() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectToMongo();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with MongoDB!');
});

// Example of using MongoDB in a route
app.get('/test-mongo', async (req, res) => {
  try {
    const database = client.db('testdb');
    const collection = database.collection('testcollection');
    const docCount = await collection.countDocuments();
    res.json({ message: `Connected to MongoDB. Document count: ${docCount}` });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({
      message: 'An error occurred',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

export default app;
