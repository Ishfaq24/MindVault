import multer from "multer";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const allowedMimeTypes = new Set([
  "application/pdf",

  "text/plain",

  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  "image/png",
  "image/jpeg",
  "image/webp",
]);

const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },

  fileFilter(req, file, cb) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(
        new Error(
          `Unsupported file type: ${file.mimetype}`
        )
      );
    }

    cb(null, true);
  },
});