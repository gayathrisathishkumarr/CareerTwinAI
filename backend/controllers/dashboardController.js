import DashboardModel from '../models/dashboardModel.js';
import ResumeModel from '../models/resumeModel.js';

export const getDashboardData = async (req, res, next) => {
  try {
    const latestResume = await ResumeModel.getLatest();
    const hasResume = !!latestResume;

    // 1. Fetch profile with fallback defaults
    const profile = (await DashboardModel.getProfessionalProfile()) || {
      name: 'Aanya Rao',
      initials: 'AR',
      role: 'Software engineer',
      location: 'San Francisco',
      years: 5,
      twinIQ: hasResume ? 82 : 0,
      readiness: hasResume ? 78 : 0,
      targetRole: 'Senior ML Engineer',
      verified: hasResume
    };

    // 2. Metrics logic: 0 when no resume uploaded, sample numbers when uploaded
    const verifiedSkills = hasResume ? 24 : 0;
    const emergingSkills = hasResume ? 6 : 0;
    const careerReadiness = hasResume ? 78 : 0;
    const recruiterViews = hasResume ? 31 : 0;
    const twinIQ = hasResume ? 82 : 0;

    // 3. Fetch recommendations
    const recommendations = hasResume ? ((await DashboardModel.getRecommendations(profile.id || 1)) || []) : [];

    // Response object
    const responseData = {
      hasResume,
      livingProfile: {
        name: profile.name,
        initials: profile.initials,
        role: profile.role,
        location: profile.location,
        years: profile.years,
        targetRole: profile.targetRole,
        verified: profile.verified
      },
      verifiedSkills,
      emergingSkills,
      careerReadiness,
      recruiterViews,
      twinIQ,
      recommendations
    };

    res.status(200).json(responseData);
  } catch (error) {
    res.status(200).json({
      hasResume: false,
      livingProfile: {},
      verifiedSkills: 0,
      emergingSkills: 0,
      careerReadiness: 0,
      recruiterViews: 0,
      twinIQ: 0,
      recommendations: []
    });
  }
};
