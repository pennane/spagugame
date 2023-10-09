import * as R from "ramda";

import { GraphQLUpload } from "graphql-upload-minimal";
import { ObjectId } from "mongodb";
import { find, get } from "../../collections/lib";
import { TContext } from "../../infrastructure/context";
import createGame from "../../services/ongoingGame/createGame";
import joinGame from "../../services/ongoingGame/joinGame";
import { gqlSerializeGame } from "../../services/ongoingGame/lib/serialize";
import { Game, GameType, Resolvers, User } from "../generated/graphql";
import { dateScalar } from "../scalars/Date/Date";
import playTurn from "../../services/ongoingGame/playTurn";
import toggleReady from "../../services/ongoingGame/toggleReady";
import {
  getAchievementUnlockKey,
  getGameChangedKey,
  getGameCreatedKey,
  getGameFromRedis,
} from "../../services/ongoingGame/lib/publish";
import leaveGame from "../../services/ongoingGame/leaveGame";
import { IUser } from "../../collections/User/User";
import { escapeRegex } from "../../lib/common";
import { IPlayedGame } from "../../collections/PlayedGame/PlayedGame";
import getLeaderboard from "../../services/leaderboard/getLeaderboard";
import { LEADERBOARD_ACHIEVEMENTS } from "../../collections/Achievement/Achievement";
import giveAchievement from "../../services/achievements/giveAchievement";
import konami from "../../services/achievements/konami";
import toggleFollow from "../../services/user/toggleFollow";
import uploadProfilePicture from "../../services/user/uploadProfilePicture";

export const resolvers: Resolvers<TContext> = {
  User: {
    achievements: async (user, _args, ctx) => {
      if (
        !(user as unknown as IUser).achievementIds ||
        (user as unknown as IUser).achievementIds.length === 0
      ) {
        return [];
      }
      const achievements = await find(ctx, "achievement", {
        filter: {
          _id: {
            $in: (user as unknown as IUser).achievementIds.map(
              (id) => new ObjectId(id)
            ),
          },
        },
      });

      return R.map(
        (g) => R.modify("_id", (id) => id.toString(), g),
        achievements
      );
    },
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
    followers: async (user, _args, ctx) => {
      if (
        !(user as unknown as IUser).followerIds ||
        (user as unknown as IUser).followerIds.length === 0
      ) {
        return [];
      }
      const followers = await find(ctx, "user", {
        filter: {
          _id: {
            $in: (user as unknown as IUser).followerIds.map(
              (id) => new ObjectId(id)
            ),
          },
        },
      });

      return R.map(
        (g) => R.modify("_id", (id) => id.toString(), g),
        followers
      ) as unknown as User[];
    },
    following: async (user, _args, ctx) => {
      if (
        !(user as unknown as IUser).followingIds ||
        (user as unknown as IUser).followingIds.length === 0
      ) {
        return [];
      }
      const followers = await find(ctx, "user", {
        filter: {
          _id: {
            $in: (user as unknown as IUser).followingIds.map(
              (id) => new ObjectId(id)
            ),
          },
        },
      });

      return R.map(
        (g) => R.modify("_id", (id) => id.toString(), g),
        followers
      ) as unknown as User[];
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
  Upload: GraphQLUpload,
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
        return R.modify("_id", (id) => id.toString(), user) as unknown as User;
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
      ) as unknown as User[];
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
    playedGame: async (_root, { id, ongoingGameId }, ctx) => {
      let game: IPlayedGame | null;

      if (id) {
        game = await get(ctx, "playedGame", {
          filter: {
            _id: new ObjectId(id),
          },
        });
      } else if (ongoingGameId) {
        game = await get(ctx, "playedGame", {
          filter: {
            ongoingGameId,
          },
        });
      } else {
        throw new Error("Need to speficy id or ongoingGameId");
      }

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
      const results = await Promise.all(
        gameTypes.map(async (gameType) => getLeaderboard(ctx, { gameType }))
      );

      const newLeaderboards = results
        .filter(({ fromCache }) => !fromCache)
        .map(({ leaderboard }) => leaderboard);

      if (newLeaderboards.length > 0) {
        Promise.all(
          newLeaderboards.map((lb) => {
            Promise.all(
              lb.players.slice(0, 3).map(async (player, i) => {
                if (i > 2) return;
                const index = (i + 1) as 1 | 2 | 3;
                const achievement =
                  LEADERBOARD_ACHIEVEMENTS[lb.gameType][index];
                if (!achievement) return;
                const { achievement: receivedAchievement } =
                  await giveAchievement(ctx, {
                    userId: player.userId,
                    achievementId: achievement._id.toString(),
                  });
                if (receivedAchievement)
                  await ctx.pubsub.publish(
                    getAchievementUnlockKey(player.userId),
                    { achievementUnlock: [receivedAchievement] }
                  );
              })
            );
          })
        );
      }

      return results.map(({ leaderboard }) => leaderboard);
    },
    achievements: async (_root, _args, ctx) => {
      const achievements = await find(ctx, "achievement", {
        filter: {},
      });
      return R.map(
        (g) => R.modify("_id", (id) => id.toString(), g),
        achievements
      );
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
    achievementUnlock: {
      subscribe: async (_root, { userId }, ctx) => {
        return {
          [Symbol.asyncIterator]: () =>
            ctx.pubsub.asyncIterator(getAchievementUnlockKey(userId)),
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
    debug: async (_root, { tokens }, ctx) => {
      const { success } = await konami(ctx, { tokens });
      return success;
    },
    toggleFollow: async (_root, { userId, toggle }, ctx) => {
      await toggleFollow(ctx, { userId, toggle });
      const user = await get(ctx, "user", {
        filter: { _id: new ObjectId(ctx.user?._id) },
      });
      if (!user) throw new Error("User not found - again");

      return R.modify("_id", (id) => id.toString(), user) as unknown as User;
    },
    uploadProfilePicture: async (_root, { file }, ctx) => {
      if (!ctx.user?._id)
        throw new Error("Tried to access service requiring higher access");
      await uploadProfilePicture(ctx, {
        file,
        userId: ctx.user._id,
      });
      const user = await get(ctx, "user", { filter: { _id: ctx.user._id } });
      if (!user) throw new Error("User not found - again");
      return R.modify("_id", (id) => id.toString(), user) as unknown as User;
    },
  },
};
