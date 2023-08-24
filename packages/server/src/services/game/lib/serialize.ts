import * as R from "ramda";
import {
  DeserializedGame,
  GqlSerializedGame,
  SerializedGame,
} from "../game.models";
import { TContext } from "../../../infrastructure/context";
import { isNilOrEmpty } from "../../../graphql/lib/fp";

export const gqlSerializeGame = <T>(
  game: DeserializedGame<T>
): GqlSerializedGame => R.evolve({ jsonState: (s) => JSON.stringify(s) }, game);

export const serializeGame = <T>(game: DeserializedGame<T>): SerializedGame =>
  R.evolve(
    { jsonState: (s) => JSON.stringify(s), players: (p) => JSON.stringify(p) },
    game
  );

export const deserializeGame = <T>(
  game: Record<string, string>
): DeserializedGame<T> =>
  R.evolve(
    { jsonState: (s) => JSON.parse(s), players: (p) => JSON.parse(p) },
    game
  ) as unknown as DeserializedGame<T>;

export const getGame = async (
  ctx: TContext,
  gameId: string
): Promise<DeserializedGame<unknown> | null> => {
  const data = await ctx.redis.hgetall(`game.${gameId}`);
  if (isNilOrEmpty(data)) return null;
  return deserializeGame(data);
};

export const saveGame = async (
  ctx: TContext,
  game: DeserializedGame<unknown>
) => {
  const serialized = serializeGame(game);

  await ctx.redis.hset(`game.${serialized._id}`, serialized);
  await ctx.redis.expire(`game.${serialized._id}`, 60);
  return serialized;
};

export const isGameInRedis = async (ctx: TContext, gameId: string) => {
  const exists = await ctx.redis.exists(`game.${gameId}`);
  return exists === 1;
};
