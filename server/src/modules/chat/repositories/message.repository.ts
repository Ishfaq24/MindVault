import { MessageRole, Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../../database/prisma.js";

export class MessageRepository {
  create(data: {
    conversationId: string;
    role: MessageRole;
    content: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return prisma.message.create({
      data,
    });
  }

  findByConversation(
    conversationId: string,
    ownerId: string
  ) {
    return prisma.message.findMany({
      where: {
        conversationId,
        conversation: {
          ownerId,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}