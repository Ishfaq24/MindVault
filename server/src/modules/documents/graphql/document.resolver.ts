import { KnowledgeDocumentService } from "../services/document.service.js";

const service = new KnowledgeDocumentService();

export const documentResolvers = {
  Query: {
    myDocuments: async (
      _: unknown,
      __: unknown,
      context: any
    ) => {
      if (!context.user) {
        throw new Error("Authentication required.");
      }

      return service.list(context.user.userId);
    },

    document: async (
      _: unknown,
      args: { id: string },
      context: any
    ) => {
      if (!context.user) {
        throw new Error("Authentication required.");
      }

      return service.get(args.id, context.user.userId);
    },

    documentChunks: async (
      _: unknown,
      args: { documentId: string },
      context: any
    ) => {
      if (!context.user) {
        throw new Error("Authentication required.");
      }

      return service.chunks(
        args.documentId,
        context.user.userId
      );
    },
  },

  KnowledgeDocument: {
    chunkCount: (document: any) => document._count.chunks,
  },
};