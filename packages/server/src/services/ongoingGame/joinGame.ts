import * as R from "ramda";
import {
  OngoingGame,
  OngoingGameProcessState,
} from "../../graphql/generated/graphql";

import { authenticatedService } from "../lib";
import { GAME_SPECIFICATIONS_MAP } from "../../games/models";
import { gqlSerializeGame } from "./lib/serialize";
import {
  getGameFromRedis,
  getUserGameKey,
  hasGameActive,
  publishGameChange,
} from "./lib/publish";

const joinGame = authenticatedService<{ gameId: string }, OngoingGame>(
  async (ctx, { gameId }) => {
    if (await hasGameActive(ctx, ctx.user._id.toString())) {
      throw new Error(
        "Cannot join multiple games at the same time. Leave old game first"
      );
    }

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

    await ctx.redis.set(getUserGameKey(ctx.user._id.toString()), game._id);

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

    await publishGameChange(ctx, gameId, { players: updatedGame.players });

    return gqlSerializeGame(updatedGame);
  }
);

export default joinGame;
