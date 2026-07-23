import { KnowledgeDocumentRepository } from "../repositories/document.repository.js";

export class KnowledgeDocumentService {
  private readonly repository = new KnowledgeDocumentRepository();

  list(ownerId: string) {
    return this.repository.findByOwner(ownerId);
  }

  async get(id: string, ownerId: string) {
    const document = await this.repository.findById(id, ownerId);

    if (!document) {
      throw new Error("Document not found.");
    }

    return document;
  }

  chunks(documentId: string, ownerId: string) {
    return this.repository.findChunks(documentId, ownerId);
  }
}