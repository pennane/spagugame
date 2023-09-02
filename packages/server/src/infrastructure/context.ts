import { IUser } from "../collections/User";

import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { CONFIG_OBJECT } from "./config";
import { initializeMongo } from "./mongo";
import { initializeRedis } from "./redis";

const createGlobalContext = async () => {
  const { db, collections } = await initializeMongo();
  const { pubsub, redis } = await initializeRedis();

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
