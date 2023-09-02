import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis, { RedisOptions } from "ioredis";
import { CONFIG_OBJECT } from "./config";

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

  return {
    redis,
    pubsub,
  };
};
