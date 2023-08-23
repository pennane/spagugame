import fs from "fs";

import { createServer } from "http";
import { WebSocketServer } from "ws";

import express from "express";
import cors from "cors";
import { json } from "body-parser";

import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { useServer } from "graphql-ws/lib/use/ws";

import { TGlobalContext, getContext } from "./infrastructure/context";
import { resolvers } from "./graphql/resolvers/root";

const typeDefs = fs.readFileSync("./src/graphql/schema.graphql", {
  encoding: "utf-8",
});

const app = express();

const schema = makeExecutableSchema({ typeDefs, resolvers });

const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer({ schema }, wsServer);

const apolloServer = new ApolloServer<TGlobalContext>({
  schema,

  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

apolloServer
  .start()
  .then(() => {
    app.use(
      "/graphql",
      cors<cors.CorsRequest>({ origin: "*" }),
      json(),
      expressMiddleware(apolloServer, {
        context: getContext,
      })
    );

    httpServer.listen(3000, () =>
      console.log("express listening on port 3000")
    );
  })
  .catch(console.error);
