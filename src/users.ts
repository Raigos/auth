import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { User, userCollection } from './models/user.js';

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
    console.log('Successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectToMongo();

const db = client.db(process.env.DB_NAME);

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser: User = {
      name,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection(userCollection).insertOne(newUser);
    res.status(201).json({ _id: result.insertedId, ...newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await db.collection(userCollection).find().toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Get a single user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await db.collection(userCollection).findOne({ _id: new ObjectId(req.params.id) });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Update a user
app.put('/users/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await db
      .collection(userCollection)
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { name, email, updatedAt: new Date() } }
      );
    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ message: 'User updated successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    const result = await db
      .collection(userCollection)
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
