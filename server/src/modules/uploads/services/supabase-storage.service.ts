import { randomUUID } from "node:crypto";
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
    filename: string
  ): Promise<UploadResult> {
    const extension = path.extname(filename);

    const storageKey = `${randomUUID()}${extension}`;

    const { error } = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .upload(storageKey, file);

    if (error) {
      throw new Error(error.message);
    }

    return {
      storageKey,
    };
  }

  async delete(storageKey: string): Promise<void> {
    const { error } = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .remove([storageKey]);

    if (error) {
      throw new Error(error.message);
    }
  }

  async getSignedUrl(storageKey: string) {
    const { data, error } = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .createSignedUrl(storageKey, 60 * 60);

    if (error) {
      throw new Error(error.message);
    }

    return data.signedUrl;
  }
}