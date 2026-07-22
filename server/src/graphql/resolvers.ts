import { scalarResolvers } from "./scalars.js";

import { healthResolvers } from "../modules/health/index.js";
import { authResolvers } from "../modules/auth/index.js";
import { uploadResolvers } from "../modules/uploads/index.js";

export const resolvers = {
  ...scalarResolvers,

  Query: {
    ...healthResolvers.Query,
    ...authResolvers.Query,
    ...uploadResolvers.Query,
  },

  Mutation: {
    ...authResolvers.Mutation,
    ...uploadResolvers.Mutation,
  },
};