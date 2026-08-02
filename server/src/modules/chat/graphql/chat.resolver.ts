import { ChatService } from "../services/chat.service.js";
import { GraphQLError } from "graphql";

const service = new ChatService();

export const ChatResolver = {
  Query: {
    askAI: async (
      _: unknown,
      args: {
        question: string;
        conversationId?: string;
      },
      context: any
    ) => {
      if (!context.user) {
        throw new Error("Authentication required.");
      }

      try {
        const result = await service.sendMessage(
          context.user.userId,
          args.question,
          args.conversationId
        );

        return {
          conversationId: result.conversationId,
          answer: result.answer,
          citations: result.chunks.map((chunk) => ({
            chunkId: chunk.chunkId,
            documentId: chunk.documentId,
            fileId: chunk.fileId,
            fileName: chunk.fileName,
            documentTitle: chunk.documentTitle,
            score: chunk.score,
            content: chunk.content,
          })),
        };
      } catch (err: any) {
        // If the LLM or RAG pipeline is unavailable, return a GraphQL error with a specific code
        console.error('askAI error:', err);
        throw new GraphQLError('The AI service is currently unavailable.', {
          extensions: { code: 'NOT_IMPLEMENTED' },
        });
      }
    },

    myConversations: async (
      _: unknown,
      __: unknown,
      context: any
    ) => {
      if (!context.user) {
        throw new Error("Authentication required.");
      }

      return service.listConversations(context.user.userId);
    },

    conversationMessages: async (
      _: unknown,
      args: { conversationId: string },
      context: any
    ) => {
      if (!context.user) {
        throw new Error("Authentication required.");
      }

      return service.getMessages(
        context.user.userId,
        args.conversationId
      );
    },
  },
};