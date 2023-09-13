import * as R from "ramda";
import {
  GAME_TYPE_INDEXED_ACHIEVEMENTS,
  IAchievement,
} from "../../collections/Achievement/Achievement";
import { TServiceHandler } from "../models";
import { ObjectId } from "mongodb";
import {
  GameType,
  TotalPlayedUnlockCriteria,
  TotalWinsUnlockCriteria,
  WinStreakUnlockCriteria,
} from "../../graphql/generated/graphql";
import { get } from "../../collections/lib";
import { IUser } from "../../collections/User/User";
import { TContext } from "../../infrastructure/context";

const checkPlayedNAchievementEntitlement = async (
  ctx: TContext,
  achievement: IAchievement & { criteria: TotalPlayedUnlockCriteria },
  user: IUser
): Promise<string | null> => {
  const gameType = achievement.criteria.gameType;
  if (!gameType) {
    const stats = await ctx.collections.userStats
      .find({ userId: user._id.toString() })
      .toArray();
    const totalPlayed = stats.reduce((acc, stat) => acc + stat.totalPlayed, 0);

    return totalPlayed >= achievement.criteria.played
      ? achievement._id.toString()
      : null;
  }
  const stats = await ctx.collections.userStats.findOne({
    userId: user._id.toString(),
    gameType,
  });

  if (!stats) return null;

  return stats.totalPlayed >= achievement.criteria.played
    ? achievement._id.toString()
    : null;
};

const checkTotalWinsAchievementEntitlement = async (
  ctx: TContext,
  achievement: IAchievement & { criteria: TotalWinsUnlockCriteria },
  user: IUser
): Promise<string | null> => {
  const gameType = achievement.criteria.gameType;
  if (!gameType) {
    const stats = await ctx.collections.userStats
      .find({ userId: user._id.toString() })
      .toArray();
    const totalWins = stats.reduce((acc, stat) => acc + stat.totalWins, 0);
    return totalWins >= achievement.criteria.wins
      ? achievement._id.toString()
      : null;
  }
  const stats = await ctx.collections.userStats.findOne({
    userId: user._id.toString(),
    gameType,
  });

  if (!stats) return null;

  return stats.totalWins >= achievement.criteria.wins
    ? achievement._id.toString()
    : null;
};

const checkWinStreakNAchievementEntitlement = async (
  ctx: TContext,
  achievement: IAchievement & { criteria: WinStreakUnlockCriteria },
  user: IUser
): Promise<string | null> => {
  const gameType = achievement.criteria.gameType;
  const playedGames = await ctx.collections.playedGame
    .find(
      { userId: user._id.toString(), ...(gameType ? { gameType } : {}) },
      {
        sort: { finishedAt: -1 },
        limit: achievement.criteria.streak,
        projection: { playerIds: 1 },
      }
    )
    .toArray();
  return playedGames.length >= achievement.criteria.streak &&
    playedGames.every((stat) => stat.playerIds[0] === user._id.toString())
    ? achievement._id.toString()
    : null;
};

const toEntitledId =
  (ctx: TContext, user: IUser) =>
  async (achievement: IAchievement): Promise<string | null> => {
    switch (achievement.criteria.__typename) {
      case "TotalPlayedUnlockCriteria":
        return checkPlayedNAchievementEntitlement(
          ctx,
          achievement as any,
          user
        );
      case "TotalWinsUnlockCriteria":
        return checkTotalWinsAchievementEntitlement(
          ctx,
          achievement as any,
          user
        );
      case "WinStreakUnlockCriteria":
        return checkWinStreakNAchievementEntitlement(
          ctx,
          achievement as any,
          user
        );
      default:
        return null;
    }
  };

const giveEntitledGameAchievements: TServiceHandler<
  { userId: string; gameType: GameType },
  { achievements: IAchievement[] }
> = async (ctx, { gameType, userId }) => {
  const targetAchievements = [
    ...GAME_TYPE_INDEXED_ACHIEVEMENTS[gameType],
    ...GAME_TYPE_INDEXED_ACHIEVEMENTS["any"],
  ];

  const user = await get(ctx, "user", {
    filter: { _id: new ObjectId(userId) },
  });

  if (!user) throw new Error(`User ${userId} not found`);

  const entitledIds: string[] = await R.pipe(
    R.reject((a: IAchievement) =>
      user?.achievementIds.includes(a._id.toString())
    ),
    R.map(toEntitledId(ctx, user)),
    (promises) => Promise.all(promises),
    R.andThen((promises) => R.reject(R.isNil, promises))
  )(targetAchievements);

  await ctx.collections.user.updateOne(
    { _id: user._id },
    { $addToSet: { achievementIds: { $each: entitledIds } } }
  );

  const achievements = await ctx.collections.achievement
    .find({
      _id: { $in: entitledIds.map((id) => new ObjectId(id)) },
    })
    .toArray();

  return { achievements };
};

export default giveEntitledGameAchievements;
