import { prisma } from "../../../database/prisma.js";
import { PrismaClient, Prisma } from "../../../generated/prisma/client.js";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export class DocumentRepository {
  constructor(
    private readonly db: PrismaExecutor = prisma
  ) {}

  create(data: {
    fileId: string;
    title?: string;
    contentLength: number;
    language?: string;
  }) {
    return this.db.document.create({
      data,
    });
  }

  findById(id: string) {
    return this.db.document.findUnique({
      where: { id },
      include: {
        chunks: true,
      },
    });
  }

  delete(id: string) {
    return this.db.document.delete({
      where: { id },
    });
  }
}