import * as R from "ramda";

import { GameType, OngoingGame } from "../../graphql/generated/graphql";

import { GAME_SETTINGS_MAP } from "../../games/models";
import { authenticatedService } from "../lib";
import { saveGame } from "./lib/serialize";

const createGame = authenticatedService<{ gameType: GameType }, OngoingGame>(
  async (ctx, { gameType }) => {
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
  }
);

export default createGame;
