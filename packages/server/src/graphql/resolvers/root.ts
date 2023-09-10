import * as R from "ramda";

import { ObjectId } from "mongodb";
import { find, get } from "../../collections/lib";
import { TContext } from "../../infrastructure/context";
import createGame from "../../services/ongoingGame/createGame";
import joinGame from "../../services/ongoingGame/joinGame";
import { gqlSerializeGame } from "../../services/ongoingGame/lib/serialize";
import {
  Game,
  GameType,
  Leaderboard,
  Resolvers,
  User,
} from "../generated/graphql";
import { dateScalar } from "../scalars/Date/Date";
import playTurn from "../../services/ongoingGame/playTurn";
import toggleReady from "../../services/ongoingGame/toggleReady";
import {
  getGameChangedKey,
  getGameCreatedKey,
  getGameFromRedis,
} from "../../services/ongoingGame/lib/publish";
import leaveGame from "../../services/ongoingGame/leaveGame";
import { IUser } from "../../collections/User";
import { escapeRegex } from "../../lib/common";
import { apolloCache } from "../../infrastructure/server";

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
    users: async (_root, { ids, nameIncludes }, ctx) => {
      let users: IUser[];

      if (ids) {
        users = await find(ctx, "user", {
          filter: { _id: { $in: ids.map((id) => new ObjectId(id)) } },
        });
      } else if (nameIncludes) {
        users = await find(ctx, "user", {
          filter: {
            userName: { $regex: escapeRegex(nameIncludes), $options: "i" },
          },
        });
      } else {
        return [];
      }

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
    leaderboards: async (_root, { gameTypes }, ctx) => {
      const now = new Date();
      const leaderboards: Leaderboard[] = await Promise.all(
        gameTypes.map(async (gameType) => {
          const cacheKey = `leaderboards:${gameType}`;
          const cachedLeaderboard = await apolloCache.get(cacheKey);

          if (cachedLeaderboard) {
            return cachedLeaderboard;
          }

          const stats = await find(ctx, "userStats", {
            filter: { gameType },
            options: {
              sort: { elo: -1, totalWins: -1 },
              limit: 10,
            },
          });

          const users = await find(ctx, "user", {
            filter: { _id: { $in: stats.map((s) => new ObjectId(s.userId)) } },
          });

          const leaderboard = {
            _id: gameType,
            gameType,
            players: stats.map((s) => {
              const user = users.find((u) => u._id.equals(s.userId));
              return {
                _id: s.userId.toString(),
                elo: s.elo,
                totalWins: s.totalWins,
                githubId: user?.githubId,
                userName: user?.userName,
                totalPlayed: s.totalPlayed,
              };
            }),
            updatedAt: now,
          };

          await apolloCache.set(cacheKey, leaderboard, {
            ttl: 60 * 15, // seconds
          });

          return leaderboard;
        })
      );

      return leaderboards;
    },
  },
  Subscription: {
    ongoingGameStateChange: {
      subscribe: async (_root, { ongoingGameId }, ctx) => {
        return {
          [Symbol.asyncIterator]: () =>
            ctx.pubsub.asyncIterator(getGameChangedKey(ongoingGameId)),
        };
      },
    },
    newOngoingGame: {
      subscribe: async (_root, { gameType }, ctx) => {
        return {
          [Symbol.asyncIterator]: () =>
            ctx.pubsub.asyncIterator(getGameCreatedKey(gameType || "*")),
        };
      },
    },
  },
  Mutation: {
    createOngoingGame: async (_root, { gameType, isPrivate }, ctx) =>
      createGame(ctx, { gameType, isPrivate: isPrivate ?? false }),
    joinOngoingGame: async (_root, { ongoingGameId }, ctx) =>
      joinGame(ctx, { gameId: ongoingGameId }),
    leaveOngoingGame: async (_root, { ongoingGameId }, ctx) =>
      leaveGame(ctx, { gameId: ongoingGameId }),
    playTurn: async (_root, { json, ongoingGameId }, ctx) =>
      playTurn(ctx, { gameId: ongoingGameId, json }),
    toggleReady: async (_root, { ready, ongoingGameId }, ctx) =>
      toggleReady(ctx, { gameId: ongoingGameId, ready }),
  },
};
