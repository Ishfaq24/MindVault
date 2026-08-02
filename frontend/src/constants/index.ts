const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const normalizeApiBaseUrl = (value: string) => {
  const normalized = trimTrailingSlash(value || '/api');

  if (normalized === '/uploads') {
    return '/api';
  }

  if (normalized.endsWith('/api/uploads')) {
    return normalized.slice(0, -'/uploads'.length);
  }

  return normalized;
};

export const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || '/graphql';
export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL || '/api');

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'mindvault_access_token',
  REFRESH_TOKEN: 'mindvault_refresh_token',
  THEME: 'mindvault_theme',
  CONVERSATIONS: 'mindvault_conversations',
  ACTIVE_CONVERSATION_ID: 'mindvault_active_conv_id',
} as const;

export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'text/x-markdown',
];

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB
