import { apolloClient } from './apolloClient';
import {
  REGISTER_MUTATION,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  LOGOUT_ALL_DEVICES_MUTATION,
  CHANGE_PASSWORD_MUTATION,
} from '../graphql/mutations';
import { tokenStorage } from './tokenStorage';
import { AuthPayload } from '../types';

export const authService = {
  async register(input: { email: string; password: string; name: string }): Promise<AuthPayload> {
    const [firstName, ...rest] = input.name.trim().split(/\s+/);
    const username = input.email.replace(/[^a-zA-Z0-9_]/g, '_');

    const { data } = await apolloClient.mutate<any>({
      mutation: REGISTER_MUTATION,
      variables: {
        input: {
          firstName,
          lastName: rest.join(' ') || null,
          username,
          email: input.email,
          password: input.password,
        },
      },
    });
    const payload = data.register as AuthPayload;
    tokenStorage.setTokens({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    });
    return payload;
  },

  async login(input: { email: string; password: string }): Promise<AuthPayload> {
    const { data } = await apolloClient.mutate<any>({
      mutation: LOGIN_MUTATION,
      variables: { input },
    });
    const payload = data.login as AuthPayload;
    tokenStorage.setTokens({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    });
    return payload;
  },

  async logout(): Promise<boolean> {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) {
        await apolloClient.mutate<any>({
          mutation: LOGOUT_MUTATION,
          variables: { input: { refreshToken } },
        });
      }
    } catch {
      // Ignore network errors during logout
    } finally {
      tokenStorage.clearTokens();
    }
    return true;
  },

  async logoutAllDevices(): Promise<boolean> {
    try {
      await apolloClient.mutate<any>({
        mutation: LOGOUT_ALL_DEVICES_MUTATION,
      });
    } finally {
      tokenStorage.clearTokens();
    }
    return true;
  },

  async changePassword(input: { oldPassword: string; newPassword: string }): Promise<boolean> {
    const { data } = await apolloClient.mutate<any>({
      mutation: CHANGE_PASSWORD_MUTATION,
      variables: {
        input: {
          currentPassword: input.oldPassword,
          newPassword: input.newPassword,
        },
      },
    });
    return !!data.changePassword?.success;
  },
};
