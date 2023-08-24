import { TServiceHandler } from "../services.models";
import { Game, GameProcessState } from "../../graphql/generated/graphql";

import { authenticatedService } from "../services.util";
import { GAME_SETTINGS_MAP } from "./game.models";
import { gqlSerializeGame, getGame } from "./lib/serialize";

const leaveGame: TServiceHandler<{ gameId: string }, Game> =
  authenticatedService(async (ctx, { gameId }) => {
    const game = await getGame(ctx, gameId);
    if (!game) throw new Error("Game does not exist");

    if (game.processState !== GameProcessState.NotStarted) {
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
  });

export default leaveGame;
