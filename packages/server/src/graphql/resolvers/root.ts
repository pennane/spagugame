import * as R from "ramda";

import { ObjectId } from "mongodb";
import { find, get } from "../../collections/lib";
import { TContext } from "../../infrastructure/context";
import createGame from "../../services/ongoingGame/createGame";
import joinGame from "../../services/ongoingGame/joinGame";
import {
  getGameFromRedis,
  gqlSerializeGame,
} from "../../services/ongoingGame/lib/serialize";
import { Game, Resolvers, UserStats } from "../generated/graphql";
import { dateScalar } from "../scalars/Date/Date";
import playTurn from "../../services/ongoingGame/playTurn";

export const resolvers: Resolvers<TContext> = {
  Game: {
    ongoingGameIds: async (game, _args, ctx) => {
      const ongoingGameIds = await ctx.redis.lrange(
        `games.${game.type}`,
        0,
        -1
      );
      return ongoingGameIds;
    },
  },
  Date: dateScalar,
  Query: {
    currentUser: async (_root, _args, ctx) => {
      if (!ctx.user?._id) return null;
      try {
        const user = (await get(ctx, "user", {
          filter: { _id: new ObjectId(ctx.user._id) },
        })) as any;
        if (user) return user;
      } catch {
        return null;
      }
    },
    user: async (_root, { id }, ctx) => {
      try {
        const user = (await get(ctx, "user", {
          filter: { _id: new ObjectId(id) },
        })) as any;
        if (user) return user;
      } catch {
        return null;
      }
    },
    users: async (_root, { ids }, ctx) => {
      const users = await find(ctx, "user", {
        filter: { _id: { $in: ids.map((id) => new ObjectId(id)) } },
      });
      return R.map(
        R.modify<"_id", ObjectId, string>("_id", (id) => id.toString()),
        users
      );
    },
    ongoingGame: async (_root, { ongoingGameId }, ctx) => {
      const game = await getGameFromRedis(ctx, ongoingGameId);
      if (!game) throw new Error("Invalid game id");
      return gqlSerializeGame(game);
    },
    game: async (_root, { gameType }, ctx) => {
      if (!gameType) return null;
      const game = await get(ctx, "game", {
        filter: { type: gameType },
      });

      if (!game) return null;
      return R.modify("_id", (id) => id.toString(), game) as Game;
    },
    games: async (_root, _args, ctx) => {
      const games = await find(ctx, "game", {
        filter: {},
      });
      return R.map(
        (g) => R.modify("_id", (id) => id.toString(), g),
        games
      ) as Game[];
    },
    userStats: async (_root, { gameType, userId }, ctx) => {
      const stats = await get(ctx, "userStats", {
        filter: { gameType, userId },
      });
      if (!stats) return null;
      const modified: UserStats = R.modify("_id", (id) => id.toString(), stats);
      return modified;
    },
  },
  Subscription: {
    ongoingGameStateChange: {
      subscribe: async (_root, { ongoingGameId }, ctx) => {
        return {
          [Symbol.asyncIterator]: () =>
            ctx.pubsub.asyncIterator(`game_changed.${ongoingGameId}`),
        };
      },
    },
    testCounter: {
      subscribe: async (_root, _args, ctx) => {
        return {
          [Symbol.asyncIterator]: () =>
            ctx.pubsub.asyncIterator(`test_counter`),
        };
      },
    },
  },
  Mutation: {
    createOngoingGame: async (_root, { gameType }, ctx) =>
      createGame(ctx, { gameType }),
    joinOngoingGame: async (_root, { ongoingGameId }, ctx) =>
      joinGame(ctx, { gameId: ongoingGameId }),
    playTurn: async (_root, { json, ongoingGameId }, ctx) =>
      playTurn(ctx, { gameId: ongoingGameId, json }),
  },
};
