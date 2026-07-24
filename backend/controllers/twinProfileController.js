import ResumeModel from '../models/resumeModel.js';
import { ResumeAnalysisService } from '../services/resumeAnalysisService.js';
import { TwinProfileService } from '../services/twinProfileService.js';

/**
 * Controller to fetch latest resume, analyze text, and generate full Twin Profile
 */
export const getTwinProfile = async (req, res, next) => {
  try {
    const latestResume = await ResumeModel.getLatest();

    let structuredAnalysis = ResumeAnalysisService.getEmptyProfile();

    if (latestResume && latestResume.extracted_text) {
      structuredAnalysis = await ResumeAnalysisService.analyzeText(latestResume.extracted_text);
    }

    const twinProfile = TwinProfileService.generateProfile(structuredAnalysis);

    res.status(200).json({
      status: 'success',
      data: twinProfile
    });
  } catch (error) {
    next(error);
  }
};
