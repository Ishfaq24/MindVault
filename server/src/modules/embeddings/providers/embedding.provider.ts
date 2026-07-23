export type EmbeddingInputType = "query" | "passage";

export interface EmbeddingProvider {
  generateEmbedding(
    text: string,
    inputType?: EmbeddingInputType
  ): Promise<number[]>;
}