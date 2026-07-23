import { SearchService } from "../services/search.service.js";

const service = new SearchService();

export const SearchResolver = {
  Query: {
    semanticSearch: async (
      _: unknown,
      args: {
        query: string;
        limit?: number;
      },
      context: any
    ) => {
      if (!context.user) {
        throw new Error("Authentication required.");
      }

      return service.search(
        context.user.userId,
        args.query,
        args.limit
      );
    },
  },
};
