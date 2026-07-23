import { prisma } from "../../../database/prisma.js";

export class KnowledgeDocumentRepository {
  findByOwner(ownerId: string) {
    return prisma.document.findMany({
      where: {
        file: {
          ownerId,
        },
      },
      include: {
        file: true,
        _count: {
          select: {
            chunks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  findById(id: string, ownerId: string) {
    return prisma.document.findFirst({
      where: {
        id,
        file: {
          ownerId,
        },
      },
      include: {
        file: true,
        _count: {
          select: {
            chunks: true,
          },
        },
      },
    });
  }

  findChunks(documentId: string, ownerId: string) {
    return prisma.documentChunk.findMany({
      where: {
        documentId,
        document: {
          file: {
            ownerId,
          },
        },
      },
      orderBy: {
        chunkIndex: "asc",
      },
    });
  }
}