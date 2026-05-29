const multer = require('multer');

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'video/mp4',
]);

/** 50 MB — the upper limit (videos). Image size is soft-validated in controllers. */
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Unsupported file type. Allowed: jpg, jpeg, png, webp, mp4'),
      false
    );
  }
};

/**
 * Multer instance with memory storage.
 * Use upload.array('media', 10) in routes for multi-file uploads.
 * Use upload.single('media') for single-file uploads.
 */
const upload = multer({
  storage:  multer.memoryStorage(),
  limits:   { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

module.exports = upload;
