import { EmbeddingService } from "../../embeddings/services/embedding.service.js";
import { SearchRepository } from "../repositories/search.repository.js";

export class SearchService {
  private embeddingService = new EmbeddingService();
  private repository = new SearchRepository();

  async search(
    ownerId: string,
    query: string,
    limit = 5
  ) {
    const vector =
      await this.embeddingService.generate(query, "query");

    return this.repository.semanticSearch(
      ownerId,
      vector,
      limit
    );
  }
}
