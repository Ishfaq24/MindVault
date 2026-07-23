import path from "node:path";

import { IngestionService } from "../../ingestion/services/ingestion.service.js";
import { SupabaseStorageService } from "./supabase-storage.service.js";
import { UploadRepository } from "../repositories/upload.repository.js";

export class UploadService {
  private readonly uploadRepository = new UploadRepository();

  private readonly storageService = new SupabaseStorageService();

  private readonly ingestionService = new IngestionService();

  async uploadFile(
    userId: string,
    file: Express.Multer.File
  ) {
    const {
      originalname,
      mimetype,
      buffer,
    } = file;

    const extension = path.extname(originalname);

    const result =
      await this.storageService.upload(
        buffer,
        originalname
      );

    const savedFile = await this.uploadRepository.createFile(
      userId,
      {
        originalName: originalname,
        filename: originalname,
        extension,
        mimeType: mimetype,
        size: buffer.length,
        storageKey: result.storageKey,
      }
    );

    this.ingestionService.ingest(savedFile.id).catch((error) => {
      console.error("Ingestion failed:", error);
    });

    return savedFile;
  }

  async reingestFile(
    fileId: string,
    userId: string
  ) {
    const file = await this.getFile(fileId, userId);

    this.ingestionService.ingest(file.id).catch((error) => {
      console.error("Re-ingestion failed:", error);
    });

    return this.uploadRepository.findById(file.id);
  }

  async getUserFiles(userId: string) {
    return this.uploadRepository.findUserFiles(
      userId
    );
  }

  async getFile(
    fileId: string,
    userId: string
  ) {
    const file =
      await this.uploadRepository.findById(
        fileId
      );

    if (!file) {
      throw new Error("File not found.");
    }

    if (file.ownerId !== userId) {
      throw new Error("Unauthorized.");
    }

    return file;
  }

  async getDownloadUrl(
    fileId: string,
    userId: string
  ) {
    const file =
      await this.getFile(fileId, userId);

    return this.storageService.getSignedUrl(
      file.storageKey
    );
  }

  async deleteFile(
    fileId: string,
    userId: string
  ) {
    const file =
      await this.getFile(fileId, userId);

    await this.storageService.delete(
      file.storageKey
    );

    await this.uploadRepository.delete(
      file.id
    );

    return {
      success: true,
    };
  }

  async renameFile(
    fileId: string,
    userId: string,
    filename: string
  ) {
    await this.getFile(fileId, userId);

    return this.uploadRepository.rename(
      fileId,
      filename
    );
  }
}