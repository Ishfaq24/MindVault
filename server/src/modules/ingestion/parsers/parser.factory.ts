import { extname } from "node:path";

import { DocumentParser } from "./parser.interface.js";
import { PDFParser } from "./pdf.parser.js";
import { TXTParser } from "./txt.parser.js";
import { MarkdownParser } from "./markdown.parser.js";
import { DOCXParser } from "./docx.parser.js";

export class ParserFactory {
  static getParser(fileName: string): DocumentParser {
    const extension = extname(fileName).toLowerCase();

    switch (extension) {
      case ".pdf":
        return new PDFParser();

      case ".txt":
        return new TXTParser();

      case ".md":
      case ".markdown":
        return new MarkdownParser();

      case ".docx":
        return new DOCXParser();

      default:
        throw new Error(`Unsupported file type: ${extension}`);
    }
  }
}