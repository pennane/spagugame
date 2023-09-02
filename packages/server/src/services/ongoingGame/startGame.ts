import { OngoingGameProcessState } from "../../graphql/generated/graphql";

import { authenticatedService } from "../lib";
import { getGameFromRedis } from "./lib/serialize";
import { GAME_SPECIFICATIONS_MAP } from "../../games/models";
import { sample, wait } from "../../lib/common";

const STARTING_DURATION_SECONDS = 5;
const SECOND_IN_MS = 1000;

const startGame = authenticatedService<{ gameId: string }, void>(
  async (ctx, { gameId }) => {
    const game = await getGameFromRedis(ctx, gameId);
    if (!game) throw new Error("Game does not exist");

    const canStart = GAME_SPECIFICATIONS_MAP[game.gameType].canStart(
      game as any
    );

    if (!canStart) return;

    await Promise.all([
      ctx.pubsub.publish(`game_changed.${gameId}`, {
        ongoingGameStateChange: {
          processState: OngoingGameProcessState.Starting,
        },
      }),
      ctx.redis.hset(`game.${gameId}`, {
        processState: OngoingGameProcessState.Starting,
      }),
    ]);

    for (let i = 0; i < STARTING_DURATION_SECONDS; i++) {
      await Promise.all([
        ctx.pubsub.publish(`game_changed.${gameId}`, {
          ongoingGameStateChange: {
            startsIn: STARTING_DURATION_SECONDS - i,
          },
        }),
        wait(SECOND_IN_MS),
      ]);
    }

    const startingUserId = sample(game.players).userId;
    await Promise.all([
      ctx.pubsub.publish(`game_changed.${gameId}`, {
        ongoingGameStateChange: {
          processState: OngoingGameProcessState.Ongoing,
          currentTurn: startingUserId,
          startsIn: 0,
        },
      }),
      ctx.redis.hset(`game.${gameId}`, {
        processState: OngoingGameProcessState.Ongoing,
        currentTurn: startingUserId,
      }),
    ]);
  }
);

export default startGame;
