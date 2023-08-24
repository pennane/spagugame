import * as R from "ramda";
import { TServiceHandler } from "../services.models";
import { Game, GameType } from "../../graphql/generated/graphql";

import { GAME_SETTINGS_MAP } from "./game.models";
import { authenticatedService } from "../services.util";
import { saveGame } from "./lib/serialize";

const createGame: TServiceHandler<{ gameType: GameType }, Game> =
  authenticatedService(async (ctx, { gameType }) => {
    const settings = GAME_SETTINGS_MAP[gameType];

    // Join the game automatically
    const initialState = R.evolve(
      {
        players: R.concat([{ score: 0, userId: ctx.user._id.toString() }]),
        jsonState: (s) => JSON.stringify(s),
      },
      settings.initialState()
    );

    await saveGame(ctx, initialState);

    return initialState;
  });

export default createGame;
