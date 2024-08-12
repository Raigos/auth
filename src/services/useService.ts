import { ObjectId } from 'mongodb';
import { User, userCollection } from '../models/user.js';
import { db } from '../config/database.js';

export const createUser = async (userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) => {
  const newUser: User = {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await db.collection(userCollection).insertOne(newUser);
  return { _id: result.insertedId, ...newUser };
};

export const getUsers = async () => {
  return db.collection(userCollection).find().toArray();
};

export const getUserById = async (id: string) => {
  return db.collection(userCollection).findOne({ _id: new ObjectId(id) });
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  const result = await db
    .collection(userCollection)
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...userData, updatedAt: new Date() } });
  return result.matchedCount > 0;
};

export const deleteUser = async (id: string) => {
  const result = await db.collection(userCollection).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
};
