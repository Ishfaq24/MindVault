import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import { env } from "../config/env.js";

const adapter = new PrismaNeon({
  connectionString: env.DATABASE_URL,
});

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

if (env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}