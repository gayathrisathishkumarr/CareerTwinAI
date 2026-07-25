import { ChatService } from '../services/chatService.js';

/**
 * POST /api/chat/ask
 * Body: { message: string, role?: 'pro' | 'rec' }
 */
export const askChat = async (req, res, next) => {
  try {
    const { message, role = 'pro' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        status: 'fail',
        message: 'Message string is required.'
      });
    }

    const responseData = await ChatService.processMessage(message, role);

    res.status(200).json({
      status: 'success',
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};
