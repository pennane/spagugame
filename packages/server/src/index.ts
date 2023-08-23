import { createServer } from "http";
import { WebSocketServer } from "ws";

import express from "express";
import cors from "cors";
import { json } from "body-parser";

import { Redis, RedisOptions } from "ioredis";

import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { useServer } from "graphql-ws/lib/use/ws";
import { RedisPubSub } from "graphql-redis-subscriptions";

const options = {
  host: "localhost",
  port: 6379,
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
} satisfies RedisOptions;

const publisher = new Redis(options);
const subscriber = new Redis(options);
const redis = new Redis(options);

const pubsub = new RedisPubSub({
  subscriber,
  publisher,
});

const typeDefs = /* GraphQL */ `
  type Query {
    messages: [Message!]!
  }

  type Message {
    content: String!
  }

  type Subscription {
    messageAdded: Message!
  }

  type Mutation {
    addMessage(content: String!): Message!
  }
`;

const MESSAGE_ADDED = "MESSAGE_ADDED";
const MESSAGES = "MESSAGES";

const resolvers = {
  Query: {
    messages: () =>
      redis
        .lrange(MESSAGES, 0, -1)
        .then((v) => v.map((content) => ({ content }))),
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator([MESSAGE_ADDED]),
    },
  },
  Mutation: {
    addMessage: (_root: unknown, { content }: { content: string }) => {
      const messageAdded = { content };
      redis.lpush("MESSAGES", content);
      pubsub.publish(MESSAGE_ADDED, { messageAdded });
      return messageAdded;
    },
  },
};

const app = express();

const schema = makeExecutableSchema({ typeDefs, resolvers });

const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer({ schema }, wsServer);

const apolloServer = new ApolloServer({
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
      expressMiddleware(apolloServer)
    );

    httpServer.listen(3000, () =>
      console.log("express listening on port 3000")
    );
  })
  .catch(console.error);
