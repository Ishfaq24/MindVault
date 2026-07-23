import { PrismaClient } from "../generated/prisma/client.js";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({
  connectionString: env.DATABASE_URL,
}, {
  onPoolError(error) {
    logger.warn({ error }, "Neon connection pool error");
  },
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
