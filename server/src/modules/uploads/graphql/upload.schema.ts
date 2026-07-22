import { gql } from "graphql-tag";

export const uploadTypeDefs = gql`
  type File {
    id: ID!
    ownerId: String!

    originalName: String!
    filename: String!

    extension: String!
    mimeType: String!

    size: Int!

    storageKey: String!

    status: String!

    createdAt: DateTime!
    updatedAt: DateTime!
  }

  extend type Query {
    myFiles: [File!]!
  }
`;