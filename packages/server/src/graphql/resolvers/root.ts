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
import { Game, GameType, Resolvers, User } from "../generated/graphql";
import { dateScalar } from "../scalars/Date/Date";
import playTurn from "../../services/ongoingGame/playTurn";
import toggleReady from "../../services/ongoingGame/toggleReady";

export const resolvers: Resolvers<TContext> = {
  User: {
    stats: async (user, { gameTypes = [] }, ctx) => {
      const stats = await find(ctx, "userStats", {
        filter: {
          userId: user._id,
          ...(R.isEmpty(gameTypes)
            ? {}
            : { gameType: { $in: gameTypes as GameType[] } }),
        },
      });
      return R.map(
        R.modify<"_id", ObjectId, string>("_id", (id) => id.toString()),
        stats
      );
    },
    playedGames: async (user, { gameTypes = [], first }, ctx) => {
      const limit = first || 10;
      const stats = await find(ctx, "playedGame", {
        filter: {
          playerIds: { $in: [user._id] },
          ...(R.isEmpty(gameTypes)
            ? {}
            : { gameType: { $in: gameTypes as GameType[] } }),
        },
        options: {
          sort: { finishedAt: -1, gameType: 1 },
          limit,
        },
      });
      return R.map(
        R.modify<"_id", ObjectId, string>("_id", (id) => id.toString()),
        stats
      );
    },
  },
  Game: {
    ongoingGames: async (game, _args, ctx) => {
      const ongoingGameIds = await ctx.redis.lrange(
        `games.${game.type}`,
        0,
        -1
      );
      const games = (
        await Promise.all(ongoingGameIds.map((id) => getGameFromRedis(ctx, id)))
      ).filter(R.isNotNil);
      return games.map(gqlSerializeGame);
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
        const user = await get(ctx, "user", {
          filter: { _id: new ObjectId(id) },
        });
        if (!user) return null;
        return R.modify("_id", (id) => id.toString(), user) as User;
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
    usersStats: async (_root, { gameType, userIds }, ctx) => {
      const stats = await find(ctx, "userStats", {
        filter: { gameType, userId: { $in: userIds } },
      });
      return R.map((g) => R.modify("_id", (id) => id.toString(), g), stats);
    },
    playedGame: async (_root, { id }, ctx) => {
      const game = await get(ctx, "playedGame", {
        filter: {
          _id: new ObjectId(id),
        },
      });
      if (!game) return null;
      return R.modify("_id", (id) => id.toString(), game);
    },
    playedGames: async (_root, { gameTypes = [], first }, ctx) => {
      const limit = first || 10;
      const stats = await find(ctx, "playedGame", {
        filter: {
          ...(R.isEmpty(gameTypes)
            ? {}
            : { gameType: { $in: gameTypes as GameType[] } }),
        },
        options: {
          sort: { finishedAt: -1, gameType: 1 },
          limit,
        },
      });
      return R.map(
        R.modify<"_id", ObjectId, string>("_id", (id) => id.toString()),
        stats
      );
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
  },
  Mutation: {
    createOngoingGame: async (_root, { gameType, isPrivate }, ctx) =>
      createGame(ctx, { gameType, isPrivate: isPrivate ?? false }),
    joinOngoingGame: async (_root, { ongoingGameId }, ctx) =>
      joinGame(ctx, { gameId: ongoingGameId }),
    playTurn: async (_root, { json, ongoingGameId }, ctx) =>
      playTurn(ctx, { gameId: ongoingGameId, json }),
    toggleReady: async (_root, { ready, ongoingGameId }, ctx) =>
      toggleReady(ctx, { gameId: ongoingGameId, ready }),
  },
};
