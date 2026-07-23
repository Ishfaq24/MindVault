import fs from "node:fs/promises";

import {
  DocumentParser,
  ParsedDocument,
} from "./parser.interface.js";

export class MarkdownParser implements DocumentParser {
  async parse(filePath: string): Promise<ParsedDocument> {
    const text = (await fs.readFile(filePath, "utf-8")).trim();

    const titleMatch = text.match(/^#\s+(.+)$/m);

    return {
      text,
      metadata: {
        title: titleMatch?.[1]?.trim(),
        wordCount: text.split(/\s+/).filter(Boolean).length,
        characterCount: text.length,
      },
    };
  }
}