import { Request, Response } from 'express';
import * as userService from '../services/useService.js';

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (deleted) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      res.status(400).json({ message: error.message });
    } else {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = await userService.registerUser(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'User already exists') {
      res.status(400).json({ message: error.message });
    } else {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error registering user' });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    if (updated) {
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
};
