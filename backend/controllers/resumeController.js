import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import ResumeModel from '../models/resumeModel.js';

/**
 * Handles PDF resume upload and automatic text extraction
 */
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please select a PDF file to upload.'
      });
    }

    const { filename, originalname, path: filepath, size: filesize } = req.file;

    // Automatically extract text from PDF
    let extractedText = '';
    try {
      const dataBuffer = fs.readFileSync(filepath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData && pdfData.text ? pdfData.text.trim() : '';
    } catch (parseError) {
      console.warn(`⚠️ Warning: Failed to extract text from PDF (${originalname}):`, parseError.message);
      extractedText = '';
    }

    const newResume = await ResumeModel.create({
      filename,
      originalFilename: originalname,
      filepath,
      filesize,
      extractedText
    });

    res.status(201).json({
      status: 'success',
      message: 'Resume uploaded and text extracted successfully.',
      data: newResume
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the latest uploaded resume record including extracted_text
 */
export const getLatestResume = async (req, res, next) => {
  try {
    const latestResume = await ResumeModel.getLatest();

    if (!latestResume) {
      return res.status(200).json({
        status: 'success',
        message: 'No resumes uploaded yet.',
        data: null
      });
    }

    res.status(200).json({
      status: 'success',
      data: latestResume
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes all resume records
 */
export const deleteResume = async (req, res, next) => {
  try {
    await ResumeModel.deleteAll();
    res.status(200).json({
      status: 'success',
      message: 'Resume deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
