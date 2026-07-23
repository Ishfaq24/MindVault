import OpenAI from "openai";
import { EmbeddingInputType, EmbeddingProvider } from "./embedding.provider.js";

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  readonly providerName = process.env.EMBEDDING_PROVIDER ?? "openai";

  readonly model =
    process.env.EMBEDDING_MODEL ??
    (process.env.NVIDIA_BASE_URL
      ? "nvidia/nv-embedqa-e5-v5"
      : "text-embedding-3-small");

  private client = new OpenAI({
    apiKey:
      process.env.EMBEDDING_API_KEY ??
      process.env.OPENAI_API_KEY ??
      process.env.NVIDIA_API_KEY,
    baseURL:
      process.env.EMBEDDING_BASE_URL ??
      process.env.OPENAI_BASE_URL ??
      process.env.NVIDIA_BASE_URL,
  });

  async generateEmbedding(
    text: string,
    inputType: EmbeddingInputType = "passage"
  ): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: this.model,
      input: text,
      input_type: inputType,
    } as any);

    return response.data[0].embedding;
  }
}
