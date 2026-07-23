import { prisma } from "../../../database/prisma.js";
import { PrismaClient, Prisma } from "../../../generated/prisma/client.js";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export class DocumentChunkRepository {
  constructor(
    private readonly db: PrismaExecutor = prisma
  ) {}

  createMany(data: any[]) {
    return this.db.documentChunk.createMany({
      data,
    });
  }

  findByDocument(documentId: string) {
    return this.db.documentChunk.findMany({
      where: {
        documentId,
      },
      orderBy: {
        chunkIndex: "asc",
      },
    });
  }

  deleteByDocument(documentId: string) {
    return this.db.documentChunk.deleteMany({
      where: {
        documentId,
      },
    });
  }
}