import * as R from "ramda";
import { DeserializedGame, GAME_SPECIFICATIONS_MAP } from "../../games/models";
import {
  OngoingGame,
  OngoingGameProcessState,
} from "../../graphql/generated/graphql";
import { authenticatedService } from "../lib";

import { getGameFromRedis, gqlSerializeGame } from "./lib/serialize";
import startGame from "./startGame";

const playTurn = authenticatedService<
  { gameId: string; ready: boolean },
  OngoingGame
>(async (ctx, { gameId, ready }) => {
  const game = await getGameFromRedis(ctx, gameId);
  if (!game) throw new Error("Game does not exist");

  if (game.processState !== OngoingGameProcessState.NotStarted) {
    throw new Error("Cannot join a game that is already started or starting");
  }

  const ongoingGameUser = game.players.find(
    (p) => p.userId === ctx.user._id.toString()
  );

  if (!ongoingGameUser) {
    throw new Error("Cannot toggle ready state for game you are not in");
  }

  if (ongoingGameUser.ready === ready) {
    throw new Error("Cannot toggle ready state to the same value");
  }

  const updatedGame = R.evolve(
    {
      players: R.map((p: DeserializedGame<unknown>["players"][number]) =>
        p.userId === ctx.user._id.toString() ? { ...p, ready } : p
      ),
    },
    game
  );

  const serializedGameUsers = JSON.stringify(updatedGame.players);

  await Promise.all([
    ctx.pubsub.publish(`game_changed.${gameId}`, {
      ongoingGameStateChange: {
        players: updatedGame.players,
      },
    }),
    ctx.redis.hset(`game.${gameId}`, {
      players: serializedGameUsers,
    }),
  ]);

  const canStart = GAME_SPECIFICATIONS_MAP[updatedGame.gameType].canStart(
    updatedGame as any
  );

  if (canStart) {
    startGame(ctx, { gameId });
  }

  return gqlSerializeGame(updatedGame);
});

export default playTurn;
