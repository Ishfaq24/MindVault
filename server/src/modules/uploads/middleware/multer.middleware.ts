import multer from "multer";
import path from "node:path";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const allowedMimeTypes = new Set([
  "application/pdf",

  "text/plain",
  "text/markdown",
  "text/x-markdown",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const allowedExtensions = new Set([
  ".pdf",
  ".docx",
  ".txt",
  ".md",
  ".markdown",
]);

const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },

  fileFilter(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();

    if (
      !allowedMimeTypes.has(file.mimetype) &&
      !allowedExtensions.has(extension)
    ) {
      return cb(
        new Error(
          "Unsupported file type. Please upload a PDF, DOCX, TXT, or Markdown file."
        )
      );
    }

    cb(null, true);
  },
});
