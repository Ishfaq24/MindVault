import { SearchService } from "../../search/services/search.service.js";
import { buildPrompt } from "../prompts/rag.prompt.js";
import { OpenAIProvider } from "../providers/openai.provider.js";

export class RAGService {
  private search = new SearchService();
  private llm = new OpenAIProvider();

  async ask(ownerId: string, question: string) {
    const chunks = await this.search.search(ownerId, question, 5);

    const context = chunks
      .map((chunk) => chunk.content)
      .join("\n\n");

    const prompt = buildPrompt(question, context);

    const answer = await this.llm.generate(
      "You answer questions from uploaded documents.",
      prompt
    );

    return {
      answer,
      chunks,
    };
  }
}
