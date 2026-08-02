import express from "express";
import path from "node:path";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import multer from "multer";
import type { NextFunction, Request, Response } from "express";

import { uploadRoutes } from "../modules/uploads/index.js";
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// app.use(helmet());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// Serve local uploads folder for development fallback storage
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

// REST Routes
app.use("/api/uploads", uploadRoutes);

app.use(
  (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "File is too large. Please upload a file smaller than 20 MB."
          : error.message;

      return res.status(400).json({
        success: false,
        message,
      });
    }

    const message =
      error.message || "Something went wrong while processing the request.";

    if (message.startsWith("Unsupported file type")) {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
);

export default app;
