import * as R from "ramda";
import {
  OngoingGame,
  OngoingGameProcessState,
} from "../../graphql/generated/graphql";

import { authenticatedService } from "../lib";
import { DeserializedGame } from "../../games/models";
import { gqlSerializeGame } from "./lib/serialize";
import { create } from "../../collections/lib";
import {
  getAchievementUnlockKey,
  getUserGameKey,
  publishGameChange,
  removeGameFromRedis,
} from "./lib/publish";
import giveEntitledGameAchievements from "../achievements/giveEntitledGameAchievements";

const calculateElo = (
  a: number,
  b: number,
  score: number,
  k: number = 32
): number => {
  const expectedScoreA = 1 / (1 + Math.pow(10, (b - a) / 400));
  return a + k * (score - expectedScoreA);
};

const calculateNewElos = (
  players: { _id: string; elo: number; score: number }[]
) => {
  const maxScore = Math.max(...players.map((p) => p.score));
  const totalElo = players.reduce((sum, player) => sum + player.elo, 0);

  const updated = [];

  for (const player of players) {
    const normalizedScore = maxScore === 0 ? 0.5 : player.score / maxScore;
    const avgOtherElo = (totalElo - player.elo) / (players.length - 1);
    const newElo = Math.round(
      calculateElo(player.elo, avgOtherElo, normalizedScore)
    );

    updated.push({
      ...player,
      newElo,
    });
  }
  return updated;
};

const finishGame = authenticatedService<
  { game: DeserializedGame<unknown> },
  OngoingGame
>(async (ctx, { game }) => {
  await removeGameFromRedis(ctx, game._id, game.gameType);

  const statsBefore = (
    await Promise.all(
      game.players.map((p) =>
        ctx.collections.userStats.findOneAndUpdate(
          { userId: p.userId, gameType: game.gameType },
          {
            $setOnInsert: {
              userId: p.userId,
              gameType: game.gameType,
              totalWins: 0,
              totalLosses: 0,
              totalDraws: 0,
              elo: 1500,
            },
          },
          { upsert: true }
        )
      )
    )
  )
    .map((r) => r.value)
    .filter(R.isNotNil);

  const eloPlayersInWinningOrder = game.players
    .map((p) => ({
      _id: p.userId,
      elo: statsBefore.find((s) => s.userId === p.userId)?.elo || 1500,
      score: p.score,
    }))
    .sort((a, b) => b.score - a.score);

  const newEloPlayers = calculateNewElos(eloPlayersInWinningOrder);

  const maxScore = Math.max(...newEloPlayers.map((p) => p.score));
  const winnerIds = newEloPlayers.every((p, _, arr) => p.score === arr[0].score)
    ? []
    : newEloPlayers.filter((p) => p.score === maxScore).map((p) => p._id);

  const now = Date.now();
  const TWENTY_MIN_IN_MS = 1000 * 60 * 20;

  const playedGame = await create(ctx, "playedGame", {
    finishedAt: new Date(now),
    ongoingGameId: game._id,
    finalState: JSON.stringify(game.jsonState),
    gameType: game.gameType,
    startedAt: new Date(game.startedAt || now - TWENTY_MIN_IN_MS),
    playerIds: R.pluck("_id", newEloPlayers),
    playerScores: R.pluck("score", newEloPlayers),
    playerElosBefore: R.pluck("elo", newEloPlayers),
    playerElosAfter: R.pluck("newElo", newEloPlayers),
  });

  const updatedGame = R.pipe(
    R.evolve({
      players: () =>
        newEloPlayers.map((p) => ({
          userId: p._id,
          score: p.score,
          ready: true,
        })),
      processState: () => OngoingGameProcessState.Finished,
    }),
    (game) => ({
      ...game,
      winnerIds,
      playedGameId: playedGame.insertedId.toString(),
    })
  )(game);

  await Promise.all(
    newEloPlayers.map((p) =>
      Promise.all([
        publishGameChange(
          ctx,
          game._id,
          {
            players: updatedGame.players,
            processState: updatedGame.processState,
            winnerIds: updatedGame.winnerIds,
            playedGameId: updatedGame.playedGameId,
          },
          { onlyPublish: true }
        ),
        ctx.redis.del(getUserGameKey(ctx.user._id.toString())),
        ctx.collections.userStats.findOneAndUpdate(
          {
            userId: p._id,
            gameType: game.gameType,
          },
          {
            $set: {
              elo: p.newElo,
            },
            $inc: {
              ...(eloPlayersInWinningOrder[0]._id === p._id &&
              eloPlayersInWinningOrder[0].score !==
                eloPlayersInWinningOrder[1].score
                ? { totalWins: 1 }
                : {}),
              totalPlayed: 1,
            },
          },
          { returnDocument: "after" }
        ),
      ])
    )
  );

  Promise.all(
    newEloPlayers.map(async (player) => {
      const { achievements } = await giveEntitledGameAchievements(ctx, {
        gameType: game.gameType,
        userId: player._id,
      });
      if (!achievements || achievements.length === 0) return;
      await ctx.pubsub.publish(getAchievementUnlockKey(player._id), {
        achievementUnlock: achievements,
      });
    })
  );

  // return final state
  return gqlSerializeGame(updatedGame);
});

export default finishGame;
