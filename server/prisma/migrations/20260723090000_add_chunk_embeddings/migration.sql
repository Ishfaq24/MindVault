CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "DocumentChunk"
ADD COLUMN "embedding" vector,
ADD COLUMN "embeddingProvider" TEXT,
ADD COLUMN "embeddingModel" TEXT,
ADD COLUMN "embeddedAt" TIMESTAMP(3);
