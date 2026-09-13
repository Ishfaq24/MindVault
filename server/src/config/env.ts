import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // ===========================================================================
  // Application
  // ===========================================================================
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z
    .preprocess((val) => {
      if (val === undefined || val === "") return 4000;
      const num = Number(val);
      return Number.isNaN(num) ? val : num;
    }, z.union([z.number(), z.string()]))
    .default(4000),

  // Database

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Authentication

  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),

  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),

  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),

  REFRESH_TOKEN_EXPIRES_IN: z.string().default("30d"),

  BCRYPT_ROUNDS: z.coerce.number().default(12),
  SUPABASE_URL: z.string().url(),

  SUPABASE_PUBLISHABLE_KEY: z.string(),

  SUPABASE_SECRET_KEY: z.string(),

  SUPABASE_STORAGE_BUCKET: z.string(),
  USE_LOCAL_STORAGE: z.coerce.boolean().default(false),
});

export const env = envSchema.parse(process.env);
