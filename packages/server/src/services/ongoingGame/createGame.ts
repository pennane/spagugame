import * as R from "ramda";

import { GameType, OngoingGame } from "../../graphql/generated/graphql";

import { GAME_SPECIFICATIONS_MAP } from "../../games/models";
import { authenticatedService } from "../lib";
import { gqlSerializeGame, saveGameToRedis } from "./lib/serialize";

const createGame = authenticatedService<
  { gameType: GameType; isPrivate: boolean },
  OngoingGame
>(async (ctx, { gameType, isPrivate }) => {
  const settings = GAME_SPECIFICATIONS_MAP[gameType];

  // Join the game automatically
  const initialState = R.evolve(
    {
      players: R.concat([
        { score: 0, userId: ctx.user._id.toString(), ready: false },
      ]),
    },
    settings.initialState({ isPrivate })
  );
  await Promise.all([
    saveGameToRedis(ctx, initialState),
    ctx.redis.lpush(`games.${gameType}`, initialState._id),
  ]);

  return gqlSerializeGame(initialState);
});

export default createGame;
