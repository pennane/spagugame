import * as R from "ramda";
import { ObjectId } from "mongodb";

import { CollectionSettings } from "../models";
import { GAME_SPECIFICATIONS_MAP } from "../../games/models";
import {
  Achievement,
  GameType,
  LeaderboardRankUnlockCriteria,
  OtherUnlockCriteria,
} from "../../graphql/generated/graphql";
import { mongoIdFromSeed } from "../../lib/mongo";

export interface IAchievement
  extends Omit<Achievement, "_id" | "ongoingGames"> {
  _id: ObjectId;
}

type IdlessAchievement = Omit<IAchievement, "_id">;

type AchievementPropsSpec = {
  name: string;
  type: GameType | null;
};

const createPlayedNTimeAchievement =
  (n: number) =>
  (spec: AchievementPropsSpec): IdlessAchievement => ({
    name: `${spec.name} ${n} time${n > 1 ? "s" : ""}`,
    description: `Play ${spec.name} ${n} time${n > 1 ? "s" : ""}`,
    criteria: {
      gameType: spec.type,
      played: n,
      __typename: "TotalPlayedUnlockCriteria" as const,
    },
  });

const createWinStreakAchievement =
  (n: number) =>
  (spec: AchievementPropsSpec): IdlessAchievement => ({
    name: `${spec.name} ${n} streak`,
    description: `Win ${spec.name} ${n} time${n > 1 ? "s" : ""} in a row`,
    criteria: {
      gameType: spec.type,
      streak: n,
      __typename: "WinStreakUnlockCriteria" as const,
    },
  });

const createTotalWinsAchievement =
  (n: number) =>
  (spec: AchievementPropsSpec): IdlessAchievement => ({
    name: `${spec.name} ${n} win${n > 1 ? "s" : ""}`,
    description: `Win ${spec.name} ${n} time${n > 1 ? "s" : ""} in total`,
    criteria: {
      gameType: spec.type,
      wins: n,
      __typename: "TotalWinsUnlockCriteria" as const,
    },
  });

const createLeaderboardAchievement =
  (n: number, name: string) =>
  (spec: AchievementPropsSpec): IdlessAchievement => ({
    name: `${spec.name} ${name}`,
    description: `Reach place ${n} in ${spec.name} leaderboard`,
    criteria: {
      gameType: spec.type,
      rank: n,
      __typename: "LeaderboardRankUnlockCriteria" as const,
    },
  });

const addIdFromName = <T extends { name: string }>(
  achievement: T
): T & { _id: ObjectId } =>
  R.assoc("_id", mongoIdFromSeed(achievement.name), achievement);

const addOtherUnlockCriteria = <T extends object>(
  achievement: T
): T & { criteria: OtherUnlockCriteria } => ({
  ...achievement,
  criteria: { __typename: "OtherUnlockCriteria" as const },
});

const createGameAchievements = R.pipe(
  R.juxt([
    createPlayedNTimeAchievement(1),
    createPlayedNTimeAchievement(10),
    createPlayedNTimeAchievement(50),
    createTotalWinsAchievement(1),
    createTotalWinsAchievement(10),
    createTotalWinsAchievement(50),
    createWinStreakAchievement(3),
    createWinStreakAchievement(5),
    createWinStreakAchievement(10),
    createLeaderboardAchievement(1, "gold"),
    createLeaderboardAchievement(2, "silver"),
    createLeaderboardAchievement(3, "bronze"),
  ]),
  R.map(addIdFromName)
);

export const PEIGOM_ACHIEVEMENT: IAchievement = addIdFromName(
  addOtherUnlockCriteria({
    name: "Peigom",
    description: "Only for the players of highest prestige",
  })
);

export const KONAMI_ACHIEVEMENT: IAchievement = addIdFromName(
  addOtherUnlockCriteria({
    name: "Konami",
    description: "??????????",
  })
);

export const SECRET_ACHIEVEMENTS: IAchievement[] = [
  PEIGOM_ACHIEVEMENT,
  KONAMI_ACHIEVEMENT,
];

const GAME_SPECIFIC_ACHIEVEMENTS = Object.values(
  GAME_SPECIFICATIONS_MAP
).flatMap(createGameAchievements);

const ANY_GAME_ACHIEVEMENTS = createGameAchievements({
  name: "Any game",
  type: null,
}).filter((a) => a.criteria.__typename !== "LeaderboardRankUnlockCriteria");

const GAME_ACHIEVEMENTS = [
  ...GAME_SPECIFIC_ACHIEVEMENTS,
  ...ANY_GAME_ACHIEVEMENTS,
];

export const ACHIEVEMENTS: IAchievement[] = [
  ...GAME_SPECIFIC_ACHIEVEMENTS,
  ...ANY_GAME_ACHIEVEMENTS,
  ...SECRET_ACHIEVEMENTS,
];

export const GAME_TYPE_INDEXED_ACHIEVEMENTS = R.groupBy(
  (a: IAchievement) => a.criteria.gameType || "any",
  GAME_ACHIEVEMENTS
) as Record<GameType | "any", IAchievement[]>;

export const LEADERBOARD_ACHIEVEMENTS = R.pipe(
  R.filter(
    (a: IAchievement) =>
      a.criteria.__typename === "LeaderboardRankUnlockCriteria"
  ),
  // @ts-expect-error too hazy
  R.groupBy((a: IAchievement) => a.criteria.gameType || "any"),
  R.map(
    R.indexBy(
      (a: IAchievement & { criteria: LeaderboardRankUnlockCriteria }) =>
        a.criteria.rank
    )
  )
)(GAME_ACHIEVEMENTS) as Record<
  GameType | "any",
  Record<1 | 2 | 3, Achievement>
>;

export const ACHIEVEMENT_COLLECTION_SETTINGS: CollectionSettings<IAchievement> =
  {
    name: "achievements",
    collectionGetter: function (db) {
      return db.collection(this.name);
    },
    indexSpecs: [],
    seedDocuments: ACHIEVEMENTS,
  };
