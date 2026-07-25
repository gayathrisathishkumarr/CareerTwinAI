import { fetchJobs, getCandidateVerifiedSkills } from '../services/jobService.js';

/**
 * GET /api/jobs/search?q=...
 */
export const searchJobsController = async (req, res, next) => {
  try {
    const query = req.query.q || 'software engineer in Bengaluru';
    const jobs = await fetchJobs(query);

    res.status(200).json({
      status: 'success',
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/matched
 */
export const getMatchedJobsController = async (req, res, next) => {
  try {
    const query = req.query.q || 'full stack software engineer';
    const jobs = await fetchJobs(query);
    const verifiedSkills = await getCandidateVerifiedSkills();

    res.status(200).json({
      status: 'success',
      verifiedSkills,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};
