import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export const authResolvers = {
  Mutation: {
    async register(_: unknown, { input }: { input: any }) {
      return authService.register(input);
    },

    async login(_: unknown, { input }: { input: any }) {
      return authService.login(input);
    },
  },
};