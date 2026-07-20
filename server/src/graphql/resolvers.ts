import { healthResolvers } from "../modules/health/index.js";
import { authResolvers } from "../modules/auth/index.js";

export const resolvers = {
  Query: {
    ...healthResolvers.Query,
    ...authResolvers.Query,
  },

  Mutation: {
    ...authResolvers.Mutation,
  },
};