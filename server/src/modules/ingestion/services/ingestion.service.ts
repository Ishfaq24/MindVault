import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { prisma } from "../../../database/prisma.js";

import { RecursiveCharacterChunker } from "../chunking/recursive.chunker.js";
import { TextChunk } from "../chunking/chunk.types.js";

import { ParserFactory } from "../parsers/parser.factory.js";

import { getStorageService } from "../../uploads/services/storage.factory.js";
import { EmbeddingService } from "../../embeddings/services/embedding.service.js";
import { EmbeddingRepository } from "../../embeddings/repositories/embedding.repository.js";
import { IngestionFileRepository } from "../repositories/file.repository.js";
import { DocumentRepository } from "../repositories/document.repository.js";
import { DocumentChunkRepository } from "../repositories/document-chunk.repository.js";

export class IngestionService {
  private readonly fileRepository = new IngestionFileRepository();

  private readonly storageService = getStorageService();

  private readonly embeddingService = new EmbeddingService();

  private readonly embeddingRepository = new EmbeddingRepository();

  private readonly chunkRepository = new DocumentChunkRepository();

  private readonly chunker = new RecursiveCharacterChunker();

  async ingest(fileId: string): Promise<{
    documentId: string;
    chunkCount: number;
  }> {
    const file = await this.fileRepository.findById(fileId);

    if (!file) {
      throw new Error("File not found.");
    }

    await prisma.file.update({
      where: {
        id: file.id,
      },
      data: {
        status: "PROCESSING",
        errorMessage: null,
        processedAt: null,
      },
    });

    const tempDirectory = await fs.mkdtemp(
      path.join(os.tmpdir(), "mindvault-ingestion-")
    );

    const filePath = path.join(
      tempDirectory,
      file.originalName
    );

    try {
      const fileBuffer = await this.storageService.download(
        file.storageKey
      );

      await fs.writeFile(filePath, fileBuffer);

      const parser = ParserFactory.getParser(file.originalName);

      const parsedDocument = await parser.parse(filePath);

      const chunks = this.chunker.chunk(parsedDocument.text);

      if (!chunks.length) {
        throw new Error("No text content found in file.");
      }

      const savedDocument = await prisma.$transaction(async (tx) => {
        const documentRepository = new DocumentRepository(tx);
        const chunkRepository = new DocumentChunkRepository(tx);

        await tx.document.deleteMany({
          where: {
            fileId: file.id,
          },
        });

        const document = await documentRepository.create({
          fileId: file.id,
          title: parsedDocument.metadata.title ?? file.originalName,
          contentLength: parsedDocument.text.length,
          language: parsedDocument.metadata.language,
        });

        await chunkRepository.createMany(
          this.mapChunks(document.id, chunks)
        );

        return document;
      });

      const savedChunks =
        await this.chunkRepository.findByDocument(
          savedDocument.id
        );

      for (const chunk of savedChunks) {
        const embedding =
          await this.embeddingService.generate(
            chunk.content,
            "passage"
          );

        await this.embeddingRepository.saveEmbedding(
          chunk.id,
          embedding,
          this.embeddingService.providerName,
          this.embeddingService.model
        );
      }

      await prisma.file.update({
        where: {
          id: file.id,
        },
        data: {
          status: "READY",
          errorMessage: null,
          processedAt: new Date(),
        },
      });

      return {
        documentId: savedDocument.id,
        chunkCount: chunks.length,
      };
    } catch (error) {
      await prisma.file.update({
        where: {
          id: file.id,
        },
        data: {
          status: "FAILED",
          errorMessage:
            error instanceof Error
              ? error.message
              : "Ingestion failed.",
          processedAt: new Date(),
        },
      });

      throw error;
    } finally {
      await fs.rm(tempDirectory, {
        recursive: true,
        force: true,
      });
    }
  }

  private mapChunks(
    documentId: string,
    chunks: TextChunk[]
  ) {
    return chunks.map((chunk) => ({
      documentId,

      chunkIndex: chunk.index,

      content: chunk.content,

      startOffset: chunk.startOffset,
      endOffset: chunk.endOffset,

      characterCount: chunk.characterCount,
      wordCount: chunk.wordCount,
      tokenCount: chunk.tokenCount,
    }));
  }
}