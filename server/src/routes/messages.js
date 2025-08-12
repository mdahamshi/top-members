import express from 'express';
import { body, validationResult } from 'express-validator';

import { getAllMessages, getMessageById, createMessage, updateMessage, deleteMessage } from '../controllers/messageController.js';
import { ensureAuthenticated, ensureSelfOrAdmin } from '../middleware/auth.js';

const validateContent = [
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
const router = express.Router();

router.get('/', getAllMessages);
router.get('/:id', getMessageById);
router.post('/',ensureAuthenticated, validateContent, createMessage);
router.put('/:id',ensureAuthenticated, ensureSelfOrAdmin, validateContent,  updateMessage);
router.delete('/:id',ensureAuthenticated, ensureSelfOrAdmin, deleteMessage);

export default router;
