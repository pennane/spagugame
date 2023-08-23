import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis, { RedisOptions } from "ioredis";

import { z } from "zod";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { IUser } from "../services/user/models";

import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import find from "../services/user/find";
import create from "../services/message/create";
import getAll from "../services/message/getAll";

export enum EAuthScope {
  UNAUTHENTICATED = "unauthenticated",
  USER = "user",
  ADMIN = "admin",
}

dotenv.config();

const envVariablesSchema = z.object({
  MONGO_CONNECTION_STRING: z.string(),
  MONGO_DB_NAME: z.string(),
});

const createGlobalContext = async () => {
  const config = envVariablesSchema.parse(process.env);

  const client = new MongoClient(config.MONGO_CONNECTION_STRING);

  await client.connect();

  const db = client.db(process.env.DB_NAME);

  const collections = {
    user: db.collection<IUser>("users"),
  } as const;

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

  const services = {
    user: {
      find: find,
    },
    message: {
      create: create,
      getAll: getAll,
    },
  };

  return {
    db,
    collections,
    redis,
    config,
    pubsub,
    services,
  };
};

const globalContext = createGlobalContext();

export const getGlobalContext = () => Promise.resolve(globalContext);

export const getContext = async (_: ExpressContextFunctionArgument) => {
  const globalContext = await Promise.resolve(getGlobalContext());
  return { ...globalContext, authScope: EAuthScope.UNAUTHENTICATED };
};

export type TGlobalContext = Awaited<ReturnType<typeof getGlobalContext>>;
