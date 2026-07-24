import { fetchGitHubInsights } from '../services/githubService.js';
import ResumeModel from '../models/resumeModel.js';

/**
 * GET /api/github/insights?username=:username
 * Optionally omit username — will auto-detect from the latest uploaded resume.
 */
export const getGitHubInsights = async (req, res, next) => {
  try {
    let { username } = req.query;

    // Auto-detect GitHub username from latest resume if not provided
    if (!username) {
      const latestResume = await ResumeModel.getLatest();
      if (latestResume && latestResume.extracted_text) {
        const ghMatch = latestResume.extracted_text.match(
          /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i
        );
        if (ghMatch) {
          username = ghMatch[1];
        }
      }
    }

    if (!username) {
      return res.status(400).json({
        status: 'fail',
        message: 'No GitHub username provided and none could be extracted from your resume. Upload a resume first or pass ?username=your-handle'
      });
    }

    const insights = await fetchGitHubInsights(username);

    res.status(200).json({
      status: 'success',
      data: insights
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({
        status: 'fail',
        message: `GitHub user "${req.query.username}" not found.`
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
