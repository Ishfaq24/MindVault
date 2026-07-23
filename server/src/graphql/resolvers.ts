import { scalarResolvers } from "./scalars.js";

import { healthResolvers } from "../modules/health/index.js";
import { authResolvers } from "../modules/auth/index.js";
import { uploadResolvers } from "../modules/uploads/index.js";
import { searchResolvers } from "../modules/search/index.js";
import { chatResolvers } from "../modules/chat/index.js";
import { documentResolvers } from "../modules/documents/index.js";

export const resolvers = {
  ...scalarResolvers,

  Query: {
    ...healthResolvers.Query,
    ...authResolvers.Query,
    ...uploadResolvers.Query,
    ...searchResolvers.Query,
    ...chatResolvers.Query,
    ...documentResolvers.Query,
  },

  Mutation: {
    ...authResolvers.Mutation,
    ...uploadResolvers.Mutation,
  },
};
