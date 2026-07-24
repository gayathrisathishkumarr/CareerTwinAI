import express from 'express';
import { getTwinProfile } from '../controllers/twinProfileController.js';

const router = express.Router();

// GET /api/twin/profile
router.get('/profile', getTwinProfile);

export default router;
