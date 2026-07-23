import fs from "node:fs/promises";

import {
  DocumentParser,
  ParsedDocument,
} from "./parser.interface.js";

export class TXTParser implements DocumentParser {
  async parse(filePath: string): Promise<ParsedDocument> {
    const text = (await fs.readFile(filePath, "utf-8")).trim();

    return {
      text,
      metadata: {
        wordCount: text.split(/\s+/).filter(Boolean).length,
        characterCount: text.length,
      },
    };
  }
}