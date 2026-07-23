import { getEncoding } from "js-tiktoken";

export class Tokenizer {
  private static readonly encoding = getEncoding("cl100k_base");

  static count(text: string): number {
    return this.encoding.encode(text).length;
  }

  static encode(text: string): number[] {
    return this.encoding.encode(text);
  }

  static decode(tokens: number[]): string {
    return this.encoding.decode(tokens);
  }
}