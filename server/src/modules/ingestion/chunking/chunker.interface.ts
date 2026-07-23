import { TextChunk } from "./chunk.types.js";

export interface Chunker {
  chunk(text: string): TextChunk[];
}