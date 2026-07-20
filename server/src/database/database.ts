import { prisma } from "./prisma.js";
import { logger } from "../config/logger.js";

export async function connectDatabase() {
  try {
    await prisma.$connect();

    logger.info("✅ Connected to Neon PostgreSQL");
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}