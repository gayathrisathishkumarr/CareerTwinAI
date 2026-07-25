import express from 'express';
import { askChat } from '../controllers/chatController.js';

const router = express.Router();

// POST /api/chat/ask
router.post('/ask', askChat);

export default router;
