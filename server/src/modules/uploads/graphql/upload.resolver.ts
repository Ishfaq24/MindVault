import { UploadService } from "../services/upload.service.js";

const uploadService = new UploadService();

export const uploadResolvers = {
  Query: {
    myFiles: async (
      _: unknown,
      __: unknown,
      context: any
    ) => {
      console.log("Context:", context);
      console.log("User:", context.user);

      return uploadService.getUserFiles(
        context.user.userId
      );
    },
  },

  Mutation: {},
};