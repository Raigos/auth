import { ObjectId } from 'mongodb';
import { User, userCollection } from '../models/user.js';
import { db } from '../config/database.js';
import bcrypt from 'bcryptjs';

export const createUser = async (userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) => {
  const newUser: User = {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await db.collection(userCollection).insertOne(newUser);
  return { _id: result.insertedId, ...newUser };
};

export const deleteUser = async (id: string) => {
  const result = await db.collection(userCollection).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
};

export const getUserById = async (id: string) => {
  return db.collection(userCollection).findOne({ _id: new ObjectId(id) });
};

export const registerUser = async (name: string, email: string, password: string) => {
  const existingUser = await db.collection(userCollection).findOne({ email });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  return { message: 'User registered successfully', userId: newUser._id };
};

export const getUsers = async () => {
  return db.collection(userCollection).find().toArray();
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  const result = await db
    .collection(userCollection)
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...userData, updatedAt: new Date() } });
  return result.matchedCount > 0;
};
