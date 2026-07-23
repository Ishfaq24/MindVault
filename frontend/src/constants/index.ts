export const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || '/graphql';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
  'application/msword',
  'text/plain',
  'text/markdown',
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
