import http from "node:http";
import express from "express";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import app from "./app.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

import { typeDefs } from "../graphql/schema.js";
import { resolvers } from "../graphql/resolvers.js";
import { createContext } from "../graphql/context.js";

export const startServer = async () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(apolloServer, {
      context: createContext,
    })
  );

  const httpServer = http.createServer(app);

  return new Promise<void>((resolve, reject) => {
    const onListening = () => {
      if (typeof env.PORT === "number") {
        logger.info(
          `🚀 Server running at http://localhost:${env.PORT}`
        );
        logger.info(
          `🚀 GraphQL Endpoint: http://localhost:${env.PORT}/graphql`
        );
      } else {
        logger.info(
          `🚀 Server running on socket/path: ${env.PORT}`
        );
        logger.info(
          `🚀 GraphQL Endpoint: /graphql`
        );
      }

      resolve();
    };

    if (typeof env.PORT === "number") {
      httpServer.listen(env.PORT, onListening);
    } else {
      httpServer.listen(env.PORT, onListening);
    }

    httpServer.on("error", (error) => {
      logger.error(error);
      reject(error);
    });
  });
};