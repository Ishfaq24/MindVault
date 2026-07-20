import { GraphQLContext } from "../../../graphql/context.js";
import { AuthService } from "../services/auth.service.js";

import { RefreshTokenDTO } from "../dto/refresh-token.dto.js";
import { LogoutDTO } from "../dto/logout.dto.js";
import { ChangePasswordDTO } from "../dto/change-password.dto.js";

const authService = new AuthService();

export const authResolvers = {
  Query: {
    async me(
      _: unknown,
      __: unknown,
      context: GraphQLContext
    ) {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      return authService.me(context.user.userId);
    },
  },

  Mutation: {
    async register(_: unknown, { input }: { input: any }) {
      return authService.register(input);
    },

    async login(_: unknown, { input }: { input: any }) {
      return authService.login(input);
    },

    async refreshToken(
      _: unknown,
      { input }: { input: RefreshTokenDTO }
    ) {
      return authService.refreshToken(input);
    },

    async logout(
      _: unknown,
      { input }: { input: LogoutDTO }
    ) {
      return authService.logout(input);
    },

    async changePassword(
      _: unknown,
      { input }: { input: ChangePasswordDTO },
      context: GraphQLContext
    ) {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      return authService.changePassword(
        context.user.userId,
        input
      );
    },
  },
};