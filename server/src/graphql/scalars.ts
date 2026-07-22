import { gql } from "graphql-tag";
import { DateTimeResolver } from "graphql-scalars";

export const scalarTypeDefs = gql`
  scalar DateTime
`;

export const scalarResolvers = {
  DateTime: DateTimeResolver,
};