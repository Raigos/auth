import express from 'express';
import {
  checkToken,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  login,
  registerUser,
  updateUser,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/check', checkToken);
router.post('/create', createUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUserById);
router.get('/', getUsers);
router.post('/login', login);
router.post('/register', registerUser);
router.put('/:id', updateUser);

export default router;
