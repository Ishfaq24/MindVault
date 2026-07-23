import { EmbeddingInputType } from "../providers/embedding.provider.js";
import { OpenAIEmbeddingProvider } from "../providers/openai.provider.js";

export class EmbeddingService {
  private provider = new OpenAIEmbeddingProvider();

  get providerName() {
    return this.provider.providerName;
  }

  get model() {
    return this.provider.model;
  }

  async generate(
    text: string,
    inputType: EmbeddingInputType = "passage"
  ) {
    return this.provider.generateEmbedding(text, inputType);
  }
}
