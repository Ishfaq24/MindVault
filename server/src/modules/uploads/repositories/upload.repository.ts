import {
  Prisma,
  FileStatus,
} from "../../../generated/prisma/client.js";
import { prisma } from "../../../database/prisma.js";

import { UploadFileDTO } from "../dto/upload-file.dto.js";

export class UploadRepository {
  async createFile(
    ownerId: string,
    input: UploadFileDTO
  ) {
    return prisma.file.create({
      data: {
        ownerId,
        originalName: input.originalName,
        filename: input.filename,
        extension: input.extension,
        mimeType: input.mimeType,
        size: input.size,
        storageKey: input.storageKey,
      },
    });
  }

  async findById(id: string) {
    return prisma.file.findUnique({
      where: { id },
    });
  }
async findUserFiles(ownerId: string) {
  console.log("ownerId:", ownerId);
  console.log("prisma.file:", prisma.file);

  return prisma.file.findMany({
    where: { ownerId },
    orderBy: {
      createdAt: Prisma.SortOrder.desc,
    },
  });
}

  async updateStatus(
    id: string,
    status: FileStatus
  ) {
    return prisma.file.update({
      where: { id },
      data: { status },
    });
  }
}