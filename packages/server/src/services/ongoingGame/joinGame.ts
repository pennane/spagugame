import * as R from "ramda";
import {
  OngoingGame,
  OngoingGameProcessState,
} from "../../graphql/generated/graphql";

import { authenticatedService } from "../lib";
import { GAME_SPECIFICATIONS_MAP } from "../../games/models";
import { gqlSerializeGame, getGame } from "./lib/serialize";
import startGame from "./startGame";

const joinGame = authenticatedService<{ gameId: string }, OngoingGame>(
  async (ctx, { gameId }) => {
    const game = await getGame(ctx, gameId);
    if (!game) throw new Error("Game does not exist");

    if (game.processState !== OngoingGameProcessState.NotStarted) {
      throw new Error("Cannot join a game that is already started or starting");
    }

    const settings = GAME_SPECIFICATIONS_MAP[game.gameType];

    if (game.players.length + 1 > settings.maxPlayers) {
      throw new Error("Cannot join a game that is already full");
    }

    const updatedGame = R.evolve(
      {
        players: R.concat([
          {
            userId: ctx.user._id.toString(),
            score: 0,
          },
        ]),
      },
      game
    );

    await ctx.redis.hset(`game.${gameId}`, {
      players: JSON.stringify(updatedGame.players),
    });

    const canStart = GAME_SPECIFICATIONS_MAP[updatedGame.gameType].canStart(
      updatedGame as any
    );

    if (canStart) {
      startGame(ctx, { gameId });
    }

    return gqlSerializeGame(game);
  }
);

export default joinGame;
