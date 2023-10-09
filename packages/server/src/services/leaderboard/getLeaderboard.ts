import { TServiceHandler } from "../models";
import { GameType, Leaderboard } from "../../graphql/generated/graphql";
import { ObjectId } from "mongodb";
import { find } from "../../collections/lib";

const getLeaderboard: TServiceHandler<
  { gameType: GameType },
  { leaderboard: Leaderboard; fromCache: boolean }
> = async (ctx, { gameType }) => {
  const now = new Date();

  const cacheKey = `leaderboards:${gameType}`;
  const cachedLeaderboard = await ctx.apolloCache.get(cacheKey);

  if (cachedLeaderboard) {
    return { leaderboard: cachedLeaderboard, fromCache: true };
  }

  const stats = await find(ctx, "userStats", {
    filter: { gameType },
    options: {
      sort: { elo: -1, totalWins: -1 },
      limit: 10,
    },
  });

  const users = await find(ctx, "user", {
    filter: {
      _id: { $in: stats.map((stat) => new ObjectId(stat.userId)) },
    },
  });

  const leaderboard = {
    _id: gameType,
    gameType,
    players: stats.map((stat) => {
      const user = users.find((user) => user._id.equals(stat.userId));
      return {
        _id: stat.userId.toString() + "" + gameType,
        userId: stat.userId.toString(),
        elo: stat.elo,
        totalWins: stat.totalWins,
        githubId: user?.githubId,
        userName: user?.userName,
        totalPlayed: stat.totalPlayed,
        profilePicture: user?.profilePicture,
      };
    }),
    updatedAt: now,
  };

  await ctx.apolloCache.set(cacheKey, leaderboard, {
    ttl: 60 * 15, // seconds
  });

  return { leaderboard, fromCache: false };
};

export default getLeaderboard;
