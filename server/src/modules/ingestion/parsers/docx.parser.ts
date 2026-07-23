import fs from "node:fs/promises";
import mammoth from "mammoth";

import {
  DocumentParser,
  ParsedDocument,
} from "./parser.interface.js";

export class DOCXParser implements DocumentParser {
  async parse(filePath: string): Promise<ParsedDocument> {
    const buffer = await fs.readFile(filePath);

    const result = await mammoth.extractRawText({
      buffer,
    });

    const text = result.value.trim();

    return {
      text,
      metadata: {
        wordCount: text.split(/\s+/).filter(Boolean).length,
        characterCount: text.length,
      },
    };
  }
}