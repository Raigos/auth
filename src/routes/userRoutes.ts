import express from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  registerUser,
  updateUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUserById);
router.get('/', getUsers);
router.post('/register', registerUser);
router.put('/:id', updateUser);

export default router;
