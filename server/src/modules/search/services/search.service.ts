import { EmbeddingService } from "../../embeddings/services/embedding.service.js";
import { SearchRepository } from "../repositories/search.repository.js";

const DEFAULT_LIMIT = 5;
const DEFAULT_MIN_CONFIDENCE = 0.35;

export class SearchService {
  private embeddingService = new EmbeddingService();
  private repository = new SearchRepository();

  async search(
    ownerId: string,
    query: string,
    limit = DEFAULT_LIMIT
  ) {
    const vector =
      await this.embeddingService.generate(query, "query");

    return this.repository.semanticSearch(
      ownerId,
      vector,
      limit,
      DEFAULT_MIN_CONFIDENCE
    );
  }
}
