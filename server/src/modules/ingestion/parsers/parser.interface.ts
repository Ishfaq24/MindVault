export interface ParsedDocument {
  text: string;
  metadata: {
    title?: string;
    pages?: number;
    language?: string;
    wordCount: number;
    characterCount: number;
  };
}

export interface DocumentParser {
  parse(filePath: string): Promise<ParsedDocument>;
}
