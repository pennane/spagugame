import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis, { RedisOptions } from "ioredis";
import { CONFIG_OBJECT } from "./config";
import { GameType } from "../graphql/generated/graphql";

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

  let i = 0;

  setInterval(() => pubsub.publish("test_counter", { testCounter: i++ }), 1000);

  // magical no-op subscription to allow pubsub listening inside server
  subscriber.psubscribe("__key*__:*", async () => {});

  pubsub.subscribe("__key*__:*", async (key: unknown) => {
    console.info("pubsub key expired:", key);

    if (typeof key !== "string") {
      return console.error("pubsub expiration key was not a string");
    }

    // shape of key is game.758299cc-a674-4c84-825a-bc06ff2a70be
    const id = key.split(".")[1];
    await Promise.all(
      Object.values(GameType).map(async (gameType) =>
        redis.lrem(`games.${gameType}`, 0, id)
      )
    );
  });

  return {
    redis,
    pubsub,
  };
};
