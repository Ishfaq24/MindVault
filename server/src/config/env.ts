import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // ===========================================================================
  // Application
  // ===========================================================================
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(4000),


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
});

export const env = envSchema.parse(process.env);