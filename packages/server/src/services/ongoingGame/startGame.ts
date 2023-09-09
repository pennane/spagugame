import { OngoingGameProcessState } from "../../graphql/generated/graphql";

import { authenticatedService } from "../lib";
import { GAME_SPECIFICATIONS_MAP, GameSpecification } from "../../games/models";
import { sample, wait } from "../../lib/common";
import { getGameFromRedis, getGameKey, publishGameChange } from "./lib/publish";

const STARTING_DURATION_SECONDS = 5;
const SECOND_IN_MS = 1000;

const startGame = authenticatedService<{ gameId: string }, void>(
  async (ctx, { gameId }) => {
    const game = await getGameFromRedis(ctx, gameId);
    if (!game) throw new Error("Game does not exist");

    const specification = GAME_SPECIFICATIONS_MAP[
      game.gameType
    ] as GameSpecification<unknown>;

    const canStart = specification.canStart(game);

    if (!canStart) return;

    await publishGameChange(ctx, gameId, {
      processState: OngoingGameProcessState.Starting,
    });

    for (let i = 0; i < STARTING_DURATION_SECONDS; i++) {
      try {
        const playersString = await ctx.redis.hget(
          getGameKey(gameId),
          "players"
        );
        if (!playersString) throw new Error("No players");
        const players = JSON.parse(playersString);
        if (!Array.isArray(players)) throw new Error("Players is not an array");

        if (players.length < specification.minPlayers) {
          await publishGameChange(ctx, gameId, {
            processState: OngoingGameProcessState.NotStarted,
          });
          return;
        }
      } catch (e) {
        console.error(e);
        await Promise.all([
          publishGameChange(
            ctx,
            gameId,
            { processState: OngoingGameProcessState.Finished },
            { onlyPublish: true }
          ),
          ctx.redis.del(getGameKey(gameId)),
        ]);

        return;
      }

      await Promise.all([
        publishGameChange(
          ctx,
          gameId,
          {
            startsIn: STARTING_DURATION_SECONDS - i,
            processState: OngoingGameProcessState.Starting,
          },
          { onlyPublish: true }
        ),
        wait(SECOND_IN_MS),
      ]);
    }

    const gameAfterStart = await getGameFromRedis(ctx, gameId);

    if (!gameAfterStart) throw new Error("Game does not exist after start");

    const now = Date.now();

    const startingUserId = sample(gameAfterStart.players).userId;

    await publishGameChange(ctx, gameId, {
      processState: OngoingGameProcessState.Ongoing,
      currentTurn: startingUserId,
      startsIn: 0,
      startedAt: now,
    });
  }
);

export default startGame;
