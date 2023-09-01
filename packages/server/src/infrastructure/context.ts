import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis, { RedisOptions } from "ioredis";

import { IUser } from "../collections/User";

import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { CONFIG_OBJECT } from "./config";
import { initializeMongo } from "./mongo";

const createGlobalContext = async () => {
  const { db, collections } = await initializeMongo();

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
    user: req?.user as IUser | undefined,
  };
  return {
    ...globalContext,
    ...additionalContext,
  };
};

export type TGlobalContext = Awaited<ReturnType<typeof getGlobalContext>>;
export type TContext = Awaited<ReturnType<typeof getContext>>;
