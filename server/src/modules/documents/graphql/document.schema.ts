import { gql } from "graphql-tag";

export const documentTypeDefs = gql`
type KnowledgeDocument {
  id: ID!
  fileId: ID!
  title: String
  contentLength: Int!
  language: String
  chunkCount: Int!
  file: File!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type DocumentChunk {
  id: ID!
  documentId: ID!
  chunkIndex: Int!
  content: String!
  startOffset: Int!
  endOffset: Int!
  characterCount: Int!
  wordCount: Int!
  tokenCount: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
}

extend type Query {
  myDocuments: [KnowledgeDocument!]!
  document(id: ID!): KnowledgeDocument!
  documentChunks(documentId: ID!): [DocumentChunk!]!
}
`;