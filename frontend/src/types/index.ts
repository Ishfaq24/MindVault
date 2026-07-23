/**
 * MindVault Global TypeScript Definitions
 */

export type FileStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'PROCESSED' | 'FAILED';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface FileMeta {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  status: FileStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  documentId: string;
  filename: string;
  chunk: string;
  score: number;
}

export interface ChatSource {
  documentId: string;
  filename: string;
  chunk: string;
}

export interface AskAIResponse {
  answer: string;
  sources: ChatSource[];
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: ChatSource[];
  isThinking?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessageItem[];
}

export interface UploadProgressItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'cancelled';
  error?: string;
  abortController?: AbortController;
  res?: FileMeta;
}
