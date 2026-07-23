export interface TextChunk {
  index: number;

  content: string;

  startOffset: number;
  endOffset: number;

  characterCount: number;
  wordCount: number;
  tokenCount: number;
}