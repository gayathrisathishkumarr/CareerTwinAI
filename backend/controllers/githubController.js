import { fetchGitHubInsights } from '../services/githubService.js';
import ResumeModel from '../models/resumeModel.js';

/**
 * GET /api/github/insights?username=:username
 * Optionally omit username — will auto-detect from the latest uploaded resume,
 * or fallback to default owner account.
 */
export const getGitHubInsights = async (req, res, next) => {
  let targetUsername = req.query.username;

  try {
    // Auto-detect GitHub username from latest resume if not provided
    if (!targetUsername) {
      const latestResume = await ResumeModel.getLatest();
      if (latestResume && latestResume.extracted_text) {
        const ghMatch = latestResume.extracted_text.match(
          /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i
        );
        if (ghMatch && ghMatch[1]) {
          targetUsername = ghMatch[1];
        }
      }
    }

    if (!targetUsername) {
      targetUsername = 'rounithrathesh-coder';
    }

    let insights;
    try {
      insights = await fetchGitHubInsights(targetUsername);
    } catch (fetchErr) {
      if (fetchErr.status === 404 && targetUsername.toLowerCase() !== 'rounithrathesh-coder') {
        console.warn(`[GitHubController] Handle "${targetUsername}" returned 404. Falling back to "rounithrathesh-coder".`);
        targetUsername = 'rounithrathesh-coder';
        insights = await fetchGitHubInsights(targetUsername);
      } else {
        throw fetchErr;
      }
    }

    res.status(200).json({
      status: 'success',
      data: insights
    });
  } catch (error) {
    const errorUser = targetUsername || req.query.username || 'unknown';
    if (error.status === 404) {
      return res.status(404).json({
        status: 'fail',
        message: `GitHub user "${errorUser}" not found.`
      });
    }
    if (error.status === 429) {
      return res.status(429).json({
        status: 'fail',
        message: error.message
      });
    }
    next(error);
  }
};

