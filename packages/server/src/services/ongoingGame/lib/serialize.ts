import * as R from "ramda";
import {
  DeserializedGame,
  GqlSerializedGame,
  SerializedGame,
} from "../../../games/models";
import { TContext } from "../../../infrastructure/context";
import { getGameKey } from "./publish";

export const gqlSerializeGame = <T extends keyof DeserializedGame<unknown>>(
  game: Pick<DeserializedGame<unknown>, T>
): Pick<GqlSerializedGame, T> =>
  R.evolve(
    { jsonState: (s) => JSON.stringify(s), startedAt: (s) => parseInt(s) },
    game
  ) as unknown as Pick<GqlSerializedGame, T>;

export const serializeGame = <T extends keyof SerializedGame>(
  game: Pick<DeserializedGame<unknown>, T>
): Pick<SerializedGame, T> =>
  R.evolve(
    {
      jsonState: (s) => JSON.stringify(s),
      players: (p) => JSON.stringify(p),
      startedAt: (s) => s.toString(),
      isPrivate: (p) => p.toString(),
    },
    game
  );

export const deserializeGame = <T extends keyof SerializedGame>(
  game: Record<T, string>
): Pick<DeserializedGame<unknown>, T> =>
  R.evolve(
    {
      jsonState: (s) => JSON.parse(s),
      players: (p) => JSON.parse(p),
      startedAt: (s) => parseInt(s),
      isPrivate: (p) => (p === "true" ? true : false),
    },
    game
  ) as unknown as DeserializedGame<T>;

export const isGameInRedis = async (ctx: TContext, gameId: string) => {
  const exists = await ctx.redis.exists(getGameKey(gameId));
  return exists === 1;
};
