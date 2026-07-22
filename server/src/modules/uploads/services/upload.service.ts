import path from "node:path";

import { SupabaseStorageService } from "./supabase-storage.service.js";

import { UploadRepository } from "../repositories/upload.repository.js";


export class UploadService {
  private readonly uploadRepository =
    new UploadRepository();

  private readonly storageService =
  new SupabaseStorageService();

  async getUserFiles(userId: string) {
    return this.uploadRepository.findUserFiles(userId);
  }

  async uploadFile(
    userId: string,
    file: Promise<FileUpload>
  ) {
    const upload = await file;

    const {
      filename,
      mimetype,
      createReadStream,
    } = upload;

    const stream = createReadStream();

    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk as Buffer);
    }

    const buffer = Buffer.concat(chunks);

    const extension = path.extname(filename);

    const result = await this.storageService.upload(
      buffer,
      filename
    );

    return this.uploadRepository.createFile(userId, {
      originalName: filename,
      filename: result.storageKey,
      extension,
      mimeType: mimetype,
      size: buffer.length,
      storageKey: result.storageKey,
    });
  }
}
