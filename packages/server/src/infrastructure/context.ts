import { IUser } from "../collections/User/User";

import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { CONFIG_OBJECT } from "./config";
import { initializeMongo } from "./mongo";
import { initializeRedis } from "./redis";

const createGlobalContext = async () => {
  const { db, collections, mongoClient } = await initializeMongo();
  const { pubsub, redis } = await initializeRedis();

  const apolloCache = new InMemoryLRUCache<any>({
    maxSize: Math.pow(2, 20) * 100,
    ttl: 900,
  });

  return {
    db,
    mongoClient,
    collections,
    redis,
    pubsub,
    apolloCache,
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
