const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const Bull = require('bull');
const winston = require('winston');
const mime = require('mime-types');
const XLSX = require('xlsx');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '..', 'logs', 'upload-error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '..', 'logs', 'upload-combined.log') 
    })
  ]
});

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': true,
      'application/vnd.ms-excel': true,
      'text/csv': true
    };

    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes[file.mimetype] && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Allowed file types: .xlsx, .xls, .csv'));
    }
  }
});

// Configure rate limiter
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 uploads per windowMs
});

// Configure Bull queue
const uploadQueue = new Bull('file-upload', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

// Process queue
uploadQueue.process(async (job) => {
  const { filePath, userId, metadata } = job.data;
  
  try {
    logger.info(`Processing file ${filePath} for user ${userId}`);
    
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    
    // Get the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Process the data
    // Add your data processing logic here
    
    return { 
      success: true, 
      metadata,
      data: data // Include processed data in response
    };
  } catch (error) {
    logger.error(`Error processing file ${filePath}:`, error);
    throw error;
  }
});

// Update the file validation function
const validateFileType = (filePath) => {
  const mimeType = mime.lookup(filePath);
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv'
  ];
  return allowedTypes.includes(mimeType);
};

// Update the upload endpoint
router.post('/file', 
  authenticateToken, 
  uploadLimiter,
  upload.single('file'), 
  async (req, res) => {
    try {
      if (!req.file) {
        throw new Error('No file uploaded');
      }

      if (req.file.size === 0) {
        fs.unlinkSync(req.file.path);
        throw new Error('Uploaded file is empty');
      }

      // Validate file type
      if (!validateFileType(req.file.originalname)) {
        fs.unlinkSync(req.file.path);
        throw new Error('Invalid file type. Allowed types: .xlsx, .xls, .csv');
      }

      const metadata = {
        size: req.file.size,
        mimetype: req.file.mimetype,
        originalname: req.file.originalname
      };

      const job = await uploadQueue.add({
        filePath: req.file.path,
        userId: req.user.id,
        metadata
      });

      res.status(202).json({
        success: true,
        message: 'File upload accepted for processing',
        jobId: job.id,
        metadata
      });
    } catch (error) {
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          logger.error('Error deleting file:', unlinkError);
        }
      }
      
      logger.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing file upload',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const queueStatus = await uploadQueue.getJobCounts();
    const diskSpace = require('fs').statfsSync(uploadDir);
    
    res.json({
      status: 'healthy',
      queue: queueStatus,
      diskSpace: {
        free: diskSpace.bfree * diskSpace.bsize,
        total: diskSpace.blocks * diskSpace.bsize
      }
    });
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

module.exports = router; 