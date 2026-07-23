import { prisma } from "../../../database/prisma.js";

export class SearchRepository {
  async semanticSearch(
    ownerId: string,
    embedding: number[],
    limit: number
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
        c.embedding <=> $1::vector AS score
      FROM "DocumentChunk" c
      INNER JOIN "Document" d ON d.id = c."documentId"
      INNER JOIN "File" f ON f.id = d."fileId"
      WHERE f."ownerId" = $2
        AND c.embedding IS NOT NULL
      ORDER BY c.embedding <=> $1::vector
      LIMIT $3;
      `,
      `[${embedding.join(",")}]`,
      ownerId,
      limit
    );

    return results.map((result) => ({
      ...result,
      score: Number(result.score),
    }));
  }
}