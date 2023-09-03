import * as R from "ramda";
import {
  OngoingGame,
  OngoingGameProcessState,
} from "../../graphql/generated/graphql";

import { authenticatedService } from "../lib";
import { GAME_SPECIFICATIONS_MAP } from "../../games/models";
import { gqlSerializeGame, getGameFromRedis } from "./lib/serialize";

const joinGame = authenticatedService<{ gameId: string }, OngoingGame>(
  async (ctx, { gameId }) => {
    const game = await getGameFromRedis(ctx, gameId);
    if (!game) throw new Error("Game does not exist");

    if (game.processState !== OngoingGameProcessState.NotStarted) {
      throw new Error("Cannot join a game that is already started or starting");
    }

    const settings = GAME_SPECIFICATIONS_MAP[game.gameType];

    if (game.players.some((p) => p.userId === ctx.user._id.toString())) {
      throw new Error("Cannot join twice");
    }

    if (game.players.length + 1 > settings.maxPlayers) {
      throw new Error("Cannot join a game that is already full");
    }

    const updatedGame = R.evolve(
      {
        players: R.concat([
          {
            userId: ctx.user._id.toString(),
            score: 0,
            ready: false,
          },
        ]),
      },
      game
    );

    const serializedPlayers = JSON.stringify(updatedGame.players);

    await Promise.all([
      ctx.redis.hset(`game.${gameId}`, {
        players: serializedPlayers,
      }),
      ctx.pubsub.publish(`game_changed.${gameId}`, {
        ongoingGameStateChange: {
          players: updatedGame.players,
        },
      }),
    ]);

    return gqlSerializeGame(game);
  }
);

export default joinGame;
