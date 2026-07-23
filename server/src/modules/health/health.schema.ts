import { gql } from "graphql-tag";

export const healthTypeDefs = gql`
  type Query {
    health: HealthResponse!
  }

  type Mutation

  type HealthResponse {
    success: Boolean!
    message: String!
  }
`;
