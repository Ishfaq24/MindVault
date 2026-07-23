import { Chunker } from "./chunker.interface.js";
import { Tokenizer } from "./tokenizer.js";
import { TextChunk } from "./chunk.types.js";
import {
  DEFAULT_CHUNK_OVERLAP,
  DEFAULT_CHUNK_SIZE,
  SEPARATORS,
} from "./constants.js";

export class RecursiveCharacterChunker implements Chunker {
  constructor(
    private readonly chunkSize = DEFAULT_CHUNK_SIZE,
    private readonly overlap = DEFAULT_CHUNK_OVERLAP
  ) {}

  chunk(text: string): TextChunk[] {
    const cleaned = text.trim();

    if (!cleaned) return [];

    const pieces = this.splitRecursive(cleaned, 0);

    return this.mergeChunks(pieces);
  }

  private splitRecursive(
    text: string,
    separatorIndex: number
  ): string[] {
    if (text.length <= this.chunkSize) {
      return [text];
    }

    if (separatorIndex >= SEPARATORS.length) {
      return this.forceSplit(text);
    }

    const separator = SEPARATORS[separatorIndex];

    if (separator === "") {
      return this.forceSplit(text);
    }

    const splits = text.split(separator);

    if (splits.length === 1) {
      return this.splitRecursive(text, separatorIndex + 1);
    }

    const results: string[] = [];

    for (const part of splits) {
      const value = part.trim();

      if (!value) continue;

      if (value.length <= this.chunkSize) {
        results.push(value);
      } else {
        results.push(
          ...this.splitRecursive(value, separatorIndex + 1)
        );
      }
    }

    return results;
  }

  private forceSplit(text: string): string[] {
    const parts: string[] = [];

    for (let i = 0; i < text.length; i += this.chunkSize) {
      parts.push(text.slice(i, i + this.chunkSize));
    }

    return parts;
  }

  private mergeChunks(parts: string[]): TextChunk[] {
    const chunks: TextChunk[] = [];

    let current = "";
    let offset = 0;

    for (const part of parts) {
      const candidate = current
        ? `${current} ${part}`
        : part;

      if (candidate.length <= this.chunkSize) {
        current = candidate;
        continue;
      }

      chunks.push(
        this.createChunk(
          chunks.length,
          current,
          offset
        )
      );

      offset += Math.max(
        current.length - this.overlap,
        0
      );

      current =
        current.slice(
          Math.max(0, current.length - this.overlap)
        ) +
        " " +
        part;
    }

    if (current.trim()) {
      chunks.push(
        this.createChunk(
          chunks.length,
          current,
          offset
        )
      );
    }

    return chunks;
  }

  private createChunk(
    index: number,
    content: string,
    startOffset: number
  ): TextChunk {
    return {
      index,

      content: content.trim(),

      startOffset,

      endOffset: startOffset + content.length,

      characterCount: content.length,

      wordCount: content
        .split(/\s+/)
        .filter(Boolean).length,

      tokenCount: Tokenizer.count(content),
    };
  }
}
