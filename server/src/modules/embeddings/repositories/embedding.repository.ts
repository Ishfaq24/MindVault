import { prisma } from "../../../database/prisma.js";

export class EmbeddingRepository {
  async saveEmbedding(
    chunkId: string,
    vector: number[],
    provider: string,
    model: string
  ) {
    const vectorLiteral = `[${vector.join(",")}]`;

    return prisma.$executeRawUnsafe(
      `
      UPDATE "DocumentChunk"
      SET
        embedding = $1::vector,
        "embeddingProvider" = $2,
        "embeddingModel" = $3,
        "embeddedAt" = NOW()
      WHERE id = $4;
      `,
      vectorLiteral,
      provider,
      model,
      chunkId
    );
  }
}
