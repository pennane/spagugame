import { TServiceHandler } from "../services.models";
import { GameProcessState } from "../../graphql/generated/graphql";

import { authenticatedService } from "../services.util";
import { getGame } from "./lib/serialize";
import { GAME_SETTINGS_MAP } from "./game.models";
import { sample, wait } from "../../graphql/lib/common";

const STARTING_DURATION_SECONDS = 5;
const SECOND_IN_MS = 1000;

const startGame: TServiceHandler<{ gameId: string }, void> =
  authenticatedService(async (ctx, { gameId }) => {
    const game = await getGame(ctx, gameId);
    if (!game) throw new Error("Game does not exist");

    const canStart = GAME_SETTINGS_MAP[game.gameType].canStart(game as any);

    if (!canStart) return;

    await Promise.all([
      ctx.pubsub.publish(`game_changed.${gameId}`, {
        gameStateChange: {
          processState: GameProcessState.Starting,
        },
      }),
      ctx.redis.hset(`game.${gameId}`, {
        processState: GameProcessState.Starting,
      }),
    ]);

    for (let i = 0; i < STARTING_DURATION_SECONDS; i++) {
      await Promise.all([
        ctx.pubsub.publish(`game_changed.${gameId}`, {
          gameStateChange: {
            startsIn: STARTING_DURATION_SECONDS - i,
          },
        }),
        wait(SECOND_IN_MS),
      ]);
    }

    const startingUserId = sample(game.players).userId;
    await Promise.all([
      ctx.pubsub.publish(`game_changed.${gameId}`, {
        gameStateChange: {
          processState: GameProcessState.Ongoing,
          currentTurn: startingUserId,
          startsIn: 0,
        },
      }),
      ctx.redis.hset(`game.${gameId}`, {
        processState: GameProcessState.Ongoing,
        currentTurn: startingUserId,
      }),
    ]);
  });

export default startGame;
