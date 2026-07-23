import OpenAI from "openai";
import { LLMProvider } from "./llm.provider.js";

export class OpenAIProvider implements LLMProvider {
  private client = new OpenAI({
    apiKey:
      process.env.LLM_API_KEY ??
      process.env.OPENAI_API_KEY ??
      process.env.NVIDIA_API_KEY,
    baseURL:
      process.env.LLM_BASE_URL ??
      process.env.OPENAI_BASE_URL ??
      process.env.NVIDIA_BASE_URL,
  });

  async generate(
    systemPrompt: string,
    userPrompt: string
  ) {
    const response = await this.client.chat.completions.create({
      model:
        process.env.LLM_MODEL ??
        (process.env.NVIDIA_BASE_URL
          ? "meta/llama-3.1-8b-instruct"
          : "gpt-4.1-mini"),
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    return response.choices[0].message.content ?? "";
  }
}
