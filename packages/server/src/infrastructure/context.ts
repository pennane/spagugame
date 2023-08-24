import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis, { RedisOptions } from "ioredis";

import { MongoClient } from "mongodb";
import { IUser } from "../services/user/user.models";

import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { CONFIG_OBJECT } from "./config";

export enum EAuthScope {
  UNAUTHENTICATED = "unauthenticated",
  USER = "user",
  ADMIN = "admin",
}

const createGlobalContext = async () => {
  const client = new MongoClient(CONFIG_OBJECT.MONGO_CONNECTION_STRING);

  await client.connect();

  const db = client.db(process.env.DB_NAME);

  const collections = {
    user: db.collection<IUser>("users"),
  } as const;

  const redisOptions = {
    host: CONFIG_OBJECT.REDIS_HOST,
    port: CONFIG_OBJECT.REDIS_PORT,
    retryStrategy: (times: number) => Math.min(times * 50, 2000),
  } satisfies RedisOptions;

  const publisher = new Redis(redisOptions);
  const subscriber = new Redis(redisOptions);
  const redis = new Redis(redisOptions);

  const pubsub = new RedisPubSub({
    subscriber,
    publisher,
  });

  return {
    db,
    collections,
    redis,
    pubsub,
    config: CONFIG_OBJECT,
  };
};

const globalContext = createGlobalContext();

export const getGlobalContext = () => Promise.resolve(globalContext);

export const getContext = async ({ req }: ExpressContextFunctionArgument) => {
  const globalContext = await Promise.resolve(getGlobalContext());
  const additionalContext = {
    authScope: req?.user ? EAuthScope.USER : EAuthScope.UNAUTHENTICATED,
    user: req?.user as IUser,
  };
  return {
    ...globalContext,
    ...additionalContext,
  };
};

export type TGlobalContext = Awaited<ReturnType<typeof getGlobalContext>>;
export type TContext = Awaited<ReturnType<typeof getContext>>;
