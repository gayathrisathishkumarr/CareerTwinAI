import express from 'express';
import { getGitHubInsights } from '../controllers/githubController.js';

const router = express.Router();

/**
 * GET /api/github/insights
 * Query params:
 *   ?username=gayathrisathishkumarr   (optional — auto-detected from resume if omitted)
 *
 * Returns: profile, stats, topRepos, languages, commitActivity
 */
router.get('/insights', getGitHubInsights);

export default router;
