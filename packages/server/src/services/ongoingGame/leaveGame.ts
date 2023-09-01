import {
  OngoingGame,
  OngoingGameProcessState,
} from "../../graphql/generated/graphql";

import { authenticatedService } from "../lib";
import { GAME_SETTINGS_MAP } from "../../games/models";
import { gqlSerializeGame, getGame } from "./lib/serialize";

const leaveGame = authenticatedService<{ gameId: string }, OngoingGame>(
  async (ctx, { gameId }) => {
    const game = await getGame(ctx, gameId);
    if (!game) throw new Error("Game does not exist");

    if (game.processState !== OngoingGameProcessState.NotStarted) {
      throw new Error("Cannot join a game that is already started or starting");
    }

    const settings = GAME_SETTINGS_MAP[game.gameType];

    if (game.players.length + 1 > settings.maxPlayers) {
      throw new Error("Cannot join a game that is already full");
    }

    const newPlayers = game.players.filter(
      (p) => p.userId !== ctx.user._id.toString()
    );

    await ctx.redis.hset(`game.${gameId}`, {
      players: JSON.stringify(newPlayers),
    });

    const canStart = GAME_SETTINGS_MAP[game.gameType].canStart(game as any);

    if (!canStart) {
      // BEGIN CANCELING GAME PERIOD
    }

    return gqlSerializeGame(game);
  }
);

export default leaveGame;
