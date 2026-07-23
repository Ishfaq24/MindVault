import { gql } from "graphql-tag";

export const chatTypeDefs = gql`
type Citation {
  chunkId: ID!
  documentId: ID!
  fileId: ID!
  fileName: String!
  documentTitle: String
  score: Float!
  content: String!
}

type ChatResponse {
  conversationId: ID!
  answer: String!
  citations: [Citation!]!
}

type Conversation {
  id: ID!
  title: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Message {
  id: ID!
  conversationId: ID!
  role: String!
  content: String!
  createdAt: DateTime!
}

extend type Query {
  askAI(question: String!, conversationId: ID): ChatResponse!
  myConversations: [Conversation!]!
  conversationMessages(conversationId: ID!): [Message!]!
}
`;