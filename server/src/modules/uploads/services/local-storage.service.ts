import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { env } from "../../../config/env.js";
import { UploadResult, StorageService } from "./storage.service.js";

export class LocalStorageService extends StorageService {
  async upload(
    file: Buffer,
    filename: string,
    _contentType?: string
  ): Promise<UploadResult> {
    const extension = path.extname(filename);

    const storageKey = `${randomUUID()}${extension}`;
    const localDir = path.resolve(process.cwd(), "uploads");

    await fs.promises.mkdir(localDir, { recursive: true });

    const localPath = path.join(localDir, storageKey);
    await fs.promises.writeFile(localPath, file);

    return {
      storageKey: `local:${storageKey}`,
    };
  }

  async delete(storageKey: string): Promise<void> {
    const key = storageKey.startsWith("local:")
      ? storageKey.replace("local:", "")
      : storageKey;

    const localPath = path.resolve(process.cwd(), "uploads", key);
    try {
      await fs.promises.unlink(localPath);
    } catch (err: any) {
      if (err && err.code === "ENOENT") return;
      throw err;
    }
  }

  async getSignedUrl(storageKey: string) {
    const key = storageKey.startsWith("local:")
      ? storageKey.replace("local:", "")
      : storageKey;

    return `http://localhost:${env.PORT}/uploads/${key}`;
  }

  async download(storageKey: string): Promise<Buffer> {
    const key = storageKey.startsWith("local:")
      ? storageKey.replace("local:", "")
      : storageKey;

    const localPath = path.resolve(process.cwd(), "uploads", key);
    return fs.promises.readFile(localPath);
  }
}
