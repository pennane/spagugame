import { GAME_SPECIFICATIONS_MAP } from "../../games/models";
import {
  OngoingGame,
  OngoingGameProcessState,
} from "../../graphql/generated/graphql";
import { authenticatedService } from "../lib";
import finishGame from "./finishGame";
import {
  getGameFromRedis,
  gqlSerializeGame,
  saveGameToRedis,
} from "./lib/serialize";

const playTurn = authenticatedService<
  { gameId: string; json: string },
  OngoingGame
>(async (ctx, { gameId, json }) => {
  const game = await getGameFromRedis(ctx, gameId);
  if (game?.currentTurn !== ctx.user._id.toString())
    throw new Error("Cannot play if it is not your turn");
  if (game.processState !== OngoingGameProcessState.Ongoing)
    throw new Error("Cannot play if the game is not ongoing");
  const newState = GAME_SPECIFICATIONS_MAP[game.gameType].nextState(
    game as any,
    json
  );
  if (!newState) {
    throw new Error("Invalid move");
  }

  await Promise.all([
    saveGameToRedis(ctx, newState),
    ctx.pubsub.publish(`game_changed.${gameId}`, {
      ongoingGameStateChange: newState,
    }),
  ]);

  if (newState.processState === OngoingGameProcessState.Finished) {
    return finishGame(ctx, { game: newState });
  }

  return gqlSerializeGame(newState);
});

export default playTurn;
