import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { supabase } from "../../../config/supabase.js";
import { env } from "../../../config/env.js";

import {
  StorageService,
  UploadResult,
} from "./storage.service.js";

export class SupabaseStorageService extends StorageService {
  async upload(
    file: Buffer,
    filename: string,
    contentType?: string
  ): Promise<UploadResult> {
    const extension = path.extname(filename);

    const storageKey = `${randomUUID()}${extension}`;

    try {
      const { error } = await supabase.storage
        .from(env.SUPABASE_STORAGE_BUCKET)
        .upload(storageKey, file as unknown as Blob | Uint8Array, {
          contentType: contentType || undefined,
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        storageKey,
      };
    } catch (err: any) {
      console.error("Supabase upload error:", err?.message || err);

      // Fallback to local filesystem storage for development when Supabase
      // is unreachable (network issues or environment restrictions).
      if ((err?.message || "").toLowerCase().includes("fetch failed")) {
        const localDir = path.resolve(process.cwd(), "uploads");

        try {
          await fs.promises.mkdir(localDir, { recursive: true });
          const localPath = path.join(localDir, storageKey);
          await fs.promises.writeFile(localPath, file);

          // Prefix storageKey so callers can distinguish local files.
          return {
            storageKey: `local:${storageKey}`,
          };
        } catch (fsErr: any) {
          console.error("Local storage fallback failed:", fsErr?.message || fsErr);
          throw new Error(
            `Failed to upload file to storage: ${err?.message || String(err)}`
          );
        }
      }

      throw new Error(
        `Failed to upload file to storage: ${err?.message || String(err)}`
      );
    }
  }

  async delete(storageKey: string): Promise<void> {
    if (storageKey.startsWith("local:")) {
      const key = storageKey.replace("local:", "");
      const localPath = path.resolve(process.cwd(), "uploads", key);
      try {
        await fs.promises.unlink(localPath);
        return;
      } catch (err: any) {
        // If the file is already missing, treat as successful delete.
        if (err && err.code === "ENOENT") {
          console.warn("Local file already removed:", localPath);
          return;
        }

        throw new Error(err?.message || String(err));
      }
    }

    const { error } = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .remove([storageKey]);

    if (error) {
      throw new Error(error.message);
    }
  }

  async getSignedUrl(storageKey: string) {
    if (storageKey.startsWith("local:")) {
      const key = storageKey.replace("local:", "");
      // Serve via local static route: /uploads/:key
      return `http://localhost:${env.PORT}/uploads/${key}`;
    }

    const { data, error } = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .createSignedUrl(storageKey, 60 * 60);

    if (error) {
      throw new Error(error.message);
    }

    return data.signedUrl;
  }

  async download(storageKey: string): Promise<Buffer> {
    if (storageKey.startsWith("local:")) {
      const key = storageKey.replace("local:", "");
      const localPath = path.resolve(process.cwd(), "uploads", key);
      return fs.promises.readFile(localPath);
    }

    const { data, error } = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .download(storageKey);

    if (error) {
      throw new Error(error.message);
    }

    return Buffer.from(await data.arrayBuffer());
  }
}
