import { gql } from "graphql-tag";

export const searchTypeDefs = gql`
type SearchResult {
  chunkId: ID!
  documentId: ID!
  fileId: ID!
  fileName: String!
  documentTitle: String
  score: Float!
  content: String!
}

extend type Query {
  semanticSearch(
    query: String!
    limit: Int = 5
  ): [SearchResult!]!
}
`;