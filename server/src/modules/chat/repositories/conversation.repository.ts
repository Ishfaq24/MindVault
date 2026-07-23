import { prisma } from "../../../database/prisma.js";

export class ConversationRepository {
  create(ownerId: string, title: string) {
    return prisma.conversation.create({
      data: {
        ownerId,
        title,
      },
    });
  }

  findById(id: string, ownerId: string) {
    return prisma.conversation.findFirst({
      where: {
        id,
        ownerId,
      },
    });
  }

  findByOwner(ownerId: string) {
    return prisma.conversation.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  touch(id: string) {
    return prisma.conversation.update({
      where: {
        id,
      },
      data: {
        updatedAt: new Date(),
      },
    });
  }
}