import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis, { RedisOptions } from "ioredis";

import { MongoClient } from "mongodb";
import { IUser } from "../services/user/models";

import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import find from "../services/user/find";
import create from "../services/message/create";
import getAll from "../services/message/getAll";
import { configObject } from "./config";

export enum EAuthScope {
  UNAUTHENTICATED = "unauthenticated",
  USER = "user",
  ADMIN = "admin",
}

const createGlobalContext = async () => {
  const client = new MongoClient(configObject.MONGO_CONNECTION_STRING);

  await client.connect();

  const db = client.db(process.env.DB_NAME);

  const collections = {
    user: db.collection<IUser>("users"),
  } as const;

  const redisOptions = {
    host: configObject.REDIS_HOST,
    port: configObject.REDIS_PORT,
    retryStrategy: (times: number) => Math.min(times * 50, 2000),
  } satisfies RedisOptions;

  const publisher = new Redis(redisOptions);
  const subscriber = new Redis(redisOptions);
  const redis = new Redis(redisOptions);

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
    config: configObject,
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
