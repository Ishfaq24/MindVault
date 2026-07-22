import {
  Request,
  Response,
  NextFunction,
} from "express";

import { UploadService } from "../services/upload.service.js";

export class UploadController {
  private readonly uploadService =
    new UploadService();

  upload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded.",
        });
      }

      const file =
        await this.uploadService.uploadFile(
          req.user!.userId,
          req.file
        );

      res.status(201).json({
        success: true,
        data: file,
      });
    } catch (error) {
      next(error);
    }
  };

  list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const files =
        await this.uploadService.getUserFiles(
          req.user!.userId
        );

      res.json({
        success: true,
        data: files,
      });
    } catch (error) {
      next(error);
    }
  };

  get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const file =
        await this.uploadService.getFile(
          req.params.id,
          req.user!.userId
        );

      res.json({
        success: true,
        data: file,
      });
    } catch (error) {
      next(error);
    }
  };

  download = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const url =
        await this.uploadService.getDownloadUrl(
          req.params.id,
          req.user!.userId
        );

      res.json({
        success: true,
        data: {
          url,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  rename = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const file =
        await this.uploadService.renameFile(
          req.params.id,
          req.user!.userId,
          req.body.filename
        );

      res.json({
        success: true,
        data: file,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.uploadService.deleteFile(
        req.params.id,
        req.user!.userId
      );

      res.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}