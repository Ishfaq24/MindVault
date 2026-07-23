import fs from "node:fs/promises";
import { PDFParse } from "pdf-parse";

import {
  DocumentParser,
  ParsedDocument,
} from "./parser.interface.js";

export class PDFParser implements DocumentParser {
  async parse(filePath: string): Promise<ParsedDocument> {
    const buffer = await fs.readFile(filePath);

    const parser = new PDFParse({
      data: buffer,
    });

    try {
      const [textResult, infoResult] = await Promise.all([
        parser.getText(),
        parser.getInfo(),
      ]);

      const text = textResult.text.trim();

      return {
        text,
        metadata: {
          title: infoResult.info?.Title || undefined,
          pages: infoResult.total,
          wordCount: text.split(/\s+/).filter(Boolean).length,
          characterCount: text.length,
        },
      };
    } finally {
      await parser.destroy();
    }
  }
}
