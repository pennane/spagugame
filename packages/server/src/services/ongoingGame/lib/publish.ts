import { DeserializedGame } from "../../../games/models";
import { GameType } from "../../../graphql/generated/graphql";

import { TContext } from "../../../infrastructure/context";
import { isNilOrEmpty } from "../../../lib/fp";
import { deserializeGame, gqlSerializeGame, serializeGame } from "./serialize";

export const getGameChangedKey = (id: string) => `game_changed.${id}` as const;
export const getGameKey = (id: string) => `game.${id}` as const;
export const getGameCreatedKey = (gameType: string) =>
  `game_created.${gameType}` as const;
export const getGamesKey = (gameType: GameType) => `games.${gameType}` as const;
export const getUserGameKey = (userId: string) =>
  `user_game.${userId}` as const;

export const publishGameChange = async <
  T extends keyof DeserializedGame<unknown>
>(
  ctx: TContext,
  id: string,
  game: Pick<DeserializedGame<unknown>, T>,
  options?: {
    updateExpiration?: boolean;
    onlyPublish?: boolean;
    onlyUpdateRedis?: boolean;
  }
) => {
  if (options?.onlyPublish && options.onlyUpdateRedis) {
    throw new Error(
      "Cannot only publish and only update redis at the same time"
    );
  }

  const serialized = serializeGame(game);
  const gqlSerialized = gqlSerializeGame(game);

  const shouldPublish = !options?.onlyUpdateRedis;
  const shouldUpdateRedis = !options?.onlyPublish;

  await Promise.all([
    shouldPublish &&
      ctx.pubsub.publish(getGameChangedKey(id), {
        ongoingGameStateChange: gqlSerialized,
      }),
    shouldUpdateRedis && ctx.redis.hset(getGameKey(id), serialized),
    options?.updateExpiration && ctx.redis.expire(getGameKey(id), 600),
  ]);
};

export const getGameFromRedis = async (
  ctx: TContext,
  gameId: string
): Promise<DeserializedGame<unknown> | null> => {
  const data = await ctx.redis.hgetall(getGameKey(gameId));
  if (isNilOrEmpty(data)) return null;
  return deserializeGame(data);
};

export const removeGameFromRedis = async (
  ctx: TContext,
  gameId: string,
  gameType: GameType
) => {
  const players = JSON.parse(
    (await ctx.redis.hget(getGameKey(gameId), "players")) || "[]"
  );
  if (Array.isArray(players)) {
    players.forEach(async (player) => {
      if (typeof player.userId === "string") {
        await ctx.redis.del(getUserGameKey(player.userId));
      }
    });
  }

  await Promise.all([
    ctx.redis.lrem(getGamesKey(gameType), 0, gameId),
    ctx.redis.del(getGameKey(gameId)),
  ]);
};

export const hasGameActive = async (ctx: TContext, userId: string) => {
  const alreadyJoinedGameId = await ctx.redis.get(getUserGameKey(userId));
  if (!alreadyJoinedGameId) return false;

  const game = await getGameFromRedis(ctx, alreadyJoinedGameId);
  if (!game) {
    await ctx.redis.del(getUserGameKey(userId));
    return false;
  }

  return true;
};
