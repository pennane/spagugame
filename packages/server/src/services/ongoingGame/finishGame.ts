import * as R from "ramda";
import { OngoingGame } from "../../graphql/generated/graphql";

import { authenticatedService } from "../lib";
import { DeserializedGame } from "../../games/models";
import { gqlSerializeGame } from "./lib/serialize";
import { create } from "../../collections/lib";

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
  const updated = [];
  const totalElo = players.reduce((sum, player) => sum + player.elo, 0);
  for (const player of players) {
    const avgOtherElo = (totalElo - player.elo) / (players.length - 1);
    const newElo = calculateElo(player.elo, avgOtherElo, player.score);

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
  // remove from redis
  await Promise.all([
    ctx.redis.lrem(`games.${game.gameType}`, 0, game._id),
    ctx.redis.del(`game.${game._id}`),
  ]);

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
    .toSorted((a, b) => b.score - a.score);

  const newEloPlayers = calculateNewElos(eloPlayersInWinningOrder);

  await Promise.all(
    newEloPlayers.map((p) =>
      ctx.collections.userStats.findOneAndUpdate(
        {
          userId: p._id,
          gameType: game.gameType,
        },
        {
          $set: {
            elo: p.newElo,
          },
          ...(eloPlayersInWinningOrder[0]._id === p._id &&
          eloPlayersInWinningOrder[0].score !==
            eloPlayersInWinningOrder[1].score
            ? { $inc: { totalWins: 1 } }
            : {}),
        }
      )
    )
  );

  const now = Date.now();
  const TWENTY_MIN_IN_MS = 1000 * 60 * 20;
  // save to mongo
  await create(ctx, "playedGame", {
    finishedAt: new Date(now),
    gameType: game.gameType,
    startedAt: new Date(game.startedAt || now - TWENTY_MIN_IN_MS),
    playerIds: R.pluck("_id", newEloPlayers),
    playerScores: R.pluck("score", newEloPlayers),
    playerElosBefore: R.pluck("elo", newEloPlayers),
    playerElosAfter: R.pluck("newElo", newEloPlayers),
  });

  // update elo

  // return final state
  return gqlSerializeGame(game);
});

export default finishGame;
