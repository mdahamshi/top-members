import express from 'express';
import { searchUName, getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { ensureAuthenticated, ensureAdmin, ensureSelfOrAdmin } from '../middleware/auth.js';
import { registerValidationRules } from '../middleware/register.js';
import { getMessagesByUser } from '../controllers/messageController.js';

const router = express.Router();

router.get('/', ensureAdmin, getAllUsers);
router.get('/check-username', searchUName);
router.get('/:id', ensureAuthenticated, ensureSelfOrAdmin, getUserById);
router.get('/:id/messages',  getMessagesByUser);
router.post('/', registerValidationRules, createUser);
router.put('/:id', ensureAuthenticated, ensureSelfOrAdmin, updateUser);
router.delete('/:id', ensureAdmin, deleteUser);
export default router;
