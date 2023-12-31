import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis, { RedisOptions } from "ioredis";
import { CONFIG_OBJECT } from "./config";
import { GameType } from "../graphql/generated/graphql";
import { getGamesKey } from "../services/ongoingGame/lib/publish";

export const initializeRedis = async () => {
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

  // magical no-op subscription to allow pubsub listening inside server
  subscriber.psubscribe("__key*__:*", async () => {});

  pubsub.subscribe("__key*__:*", async (key: unknown) => {
    if (typeof key !== "string") {
      return console.error("pubsub expiration key was not a string");
    }

    // shape of key is game.758299cc-a674-4c84-825a-bc06ff2a70be
    const [base, id] = key.split(".");
    if (base === "game") {
      await Promise.all(
        Object.values(GameType).map(async (gameType) =>
          redis.lrem(getGamesKey(gameType), 0, id)
        )
      );
    }
  });

  return {
    redis,
    pubsub,
  };
};
