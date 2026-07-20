export const healthResolvers = {
  Query: {
    health: () => ({
      success: true,
      message: "MindVault GraphQL API is running 🚀",
    }),
  },
};