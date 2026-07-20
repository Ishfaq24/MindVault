import gql from "graphql-tag";

export const authTypeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    avatarUrl: String
    role: String!
    isVerified: Boolean!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    user: User!
    accessToken: String!
    refreshToken: String!
  }

  input RegisterInput {
    firstName: String!
    lastName: String
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  extend type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
  }
`;