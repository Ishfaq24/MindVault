import { prisma } from "../../../database/prisma.js";

export class IngestionFileRepository {
  async findById(id: string) {
    return prisma.file.findUnique({
      where: { id },
    });
  }
}