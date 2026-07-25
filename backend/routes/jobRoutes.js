import express from 'express';
import { searchJobsController, getMatchedJobsController } from '../controllers/jobController.js';

const router = express.Router();

router.get('/search', searchJobsController);
router.get('/matched', getMatchedJobsController);

export default router;
