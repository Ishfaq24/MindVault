/**
 * SECURITY NOTE:
 * Storing access and refresh tokens in localStorage exposes them to potential XSS attacks.
 * This implementation encapsulates token management behind a single module interface.
 * The recommended production upgrade path is using httpOnly, Secure, SameSite cookies
 * set directly by the authentication backend.
 */

import { STORAGE_KEYS } from '../constants';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  getTokens(): Tokens | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }
    return null;
  },

  setTokens(tokens: Tokens): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  },

  clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
};
