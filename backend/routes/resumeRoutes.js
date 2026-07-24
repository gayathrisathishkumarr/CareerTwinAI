import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { uploadResume, getLatestResume } from '../controllers/resumeController.js';

const router = express.Router();

// Custom upload middleware to handle Multer validation errors cleanly
const handleUpload = (req, res, next) => {
  // Accepts field name 'resume' or 'file'
  const uploadSingle = upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]);

  uploadSingle(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: 'fail',
          message: 'File size exceeds maximum limit of 5 MB.'
        });
      }
      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
          status: 'fail',
          message: err.message
        });
      }
      return res.status(400).json({
        status: 'fail',
        message: err.message || 'File upload error.'
      });
    }

    // Normalize field file object to req.file
    if (req.files) {
      if (req.files.resume && req.files.resume.length > 0) {
        req.file = req.files.resume[0];
      } else if (req.files.file && req.files.file.length > 0) {
        req.file = req.files.file[0];
      }
    }

    next();
  });
};

// POST /api/resume/upload
router.post('/upload', handleUpload, uploadResume);

// GET /api/resume/latest
router.get('/latest', getLatestResume);

export default router;
