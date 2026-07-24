import ResumeModel from '../models/resumeModel.js';
import { ResumeAnalysisService } from '../services/resumeAnalysisService.js';

/**
 * Controller to analyze the latest uploaded resume text
 * Returns structured Career Twin profile JSON
 */
export const analyzeResume = async (req, res, next) => {
  try {
    const latestResume = await ResumeModel.getLatest();

    if (!latestResume || !latestResume.extracted_text) {
      return res.status(200).json({
        status: 'success',
        message: 'No extracted resume text available to analyze.',
        data: ResumeAnalysisService.getEmptyProfile()
      });
    }

    const structuredProfile = await ResumeAnalysisService.analyzeText(latestResume.extracted_text);

    res.status(200).json({
      status: 'success',
      data: structuredProfile
    });
  } catch (error) {
    next(error);
  }
};
