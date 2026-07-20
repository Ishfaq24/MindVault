import http from "node:http";
import express from "express";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import app from "./app.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

import { typeDefs } from "../graphql/schema.js";
import { resolvers } from "../graphql/resolvers.js";

export const startServer = async () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(apolloServer)
  );

  const httpServer = http.createServer(app);

  return new Promise<void>((resolve, reject) => {
    httpServer.listen(env.PORT, () => {
      logger.info(
        `🚀 Server running at http://localhost:${env.PORT}`
      );

      logger.info(
        `🚀 GraphQL Endpoint: http://localhost:${env.PORT}/graphql`
      );

      resolve();
    });

    httpServer.on("error", (error) => {
      logger.error(error);
      reject(error);
    });
  });
};