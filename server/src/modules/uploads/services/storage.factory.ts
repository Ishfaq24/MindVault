import { env } from "../../../config/env.js";
import { SupabaseStorageService } from "./supabase-storage.service.js";
import { LocalStorageService } from "./local-storage.service.js";

export function getStorageService() {
  if (env.USE_LOCAL_STORAGE) {
    return new LocalStorageService();
  }

  return new SupabaseStorageService();
}
