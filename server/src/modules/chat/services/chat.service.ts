import { MessageRole } from "../../../generated/prisma/client.js";
import { RAGService } from "./rag.service.js";
import { ConversationRepository } from "../repositories/conversation.repository.js";
import { MessageRepository } from "../repositories/message.repository.js";

export class ChatService {
  private rag = new RAGService();

  private conversations = new ConversationRepository();

  private messages = new MessageRepository();

  async sendMessage(
    ownerId: string,
    question: string,
    conversationId?: string
  ) {
    const conversation = conversationId
      ? await this.getConversation(conversationId, ownerId)
      : await this.conversations.create(
          ownerId,
          this.createTitle(question)
        );

    await this.messages.create({
      conversationId: conversation.id,
      role: MessageRole.USER,
      content: question,
    });

    const result = await this.rag.ask(ownerId, question);

    await this.messages.create({
      conversationId: conversation.id,
      role: MessageRole.ASSISTANT,
      content: result.answer,
      metadata: {
        citations: result.chunks,
      },
    });

    await this.conversations.touch(conversation.id);

    return {
      conversationId: conversation.id,
      ...result,
    };
  }

  listConversations(ownerId: string) {
    return this.conversations.findByOwner(ownerId);
  }

  async getMessages(
    ownerId: string,
    conversationId: string
  ) {
    await this.getConversation(conversationId, ownerId);

    return this.messages.findByConversation(
      conversationId,
      ownerId
    );
  }

  private async getConversation(
    conversationId: string,
    ownerId: string
  ) {
    const conversation = await this.conversations.findById(
      conversationId,
      ownerId
    );

    if (!conversation) {
      throw new Error("Conversation not found.");
    }

    return conversation;
  }

  private createTitle(question: string) {
    return question.trim().slice(0, 80) || "New chat";
  }
}