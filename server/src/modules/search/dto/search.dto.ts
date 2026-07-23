export interface SearchRequest {
  query: string;
  limit?: number;
}

export interface SearchResult {
  chunkId: string;
  documentId: string;
  score: number;
  content: string;
}