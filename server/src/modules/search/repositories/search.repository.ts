import { prisma } from "../../../database/prisma.js";

export class SearchRepository {
  async semanticSearch(
    ownerId: string,
    embedding: number[],
    limit: number,
    minConfidence: number
  ) {
    const results = await prisma.$queryRawUnsafe<
      {
        chunkId: string;
        documentId: string;
        fileId: string;
        fileName: string;
        documentTitle: string | null;
        content: string;
        score: number;
      }[]
    >(
      `
      SELECT
        c.id AS "chunkId",
        c."documentId",
        d."fileId",
        f."filename" AS "fileName",
        d."title" AS "documentTitle",
        c.content,
        GREATEST(0, LEAST(1, 1 - ((c.embedding <=> $1::vector) / 2))) AS score
      FROM "DocumentChunk" c
      INNER JOIN "Document" d ON d.id = c."documentId"
      INNER JOIN "File" f ON f.id = d."fileId"
      WHERE f."ownerId" = $2
        AND c.embedding IS NOT NULL
        AND GREATEST(0, LEAST(1, 1 - ((c.embedding <=> $1::vector) / 2))) >= $4
      ORDER BY score DESC
      LIMIT $3;
      `,
      `[${embedding.join(",")}]`,
      ownerId,
      limit,
      minConfidence
    );

    return results.map((result) => ({
      ...result,
      score: Number(result.score),
    }));
  }
}