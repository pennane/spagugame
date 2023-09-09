import * as R from "ramda";

import { GameType, OngoingGame } from "../../graphql/generated/graphql";

import { GAME_SPECIFICATIONS_MAP } from "../../games/models";
import { authenticatedService } from "../lib";
import { gqlSerializeGame } from "./lib/serialize";
import {
  getGameCreatedKey,
  getGamesKey,
  getUserGameKey,
  hasGameActive,
  publishGameChange,
} from "./lib/publish";

const createGame = authenticatedService<
  { gameType: GameType; isPrivate: boolean },
  OngoingGame
>(async (ctx, { gameType, isPrivate }) => {
  if (await hasGameActive(ctx, ctx.user._id.toString())) {
    throw new Error(
      "Cannot join multiple games at the same time. Leave old game first"
    );
  }

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

  const gqlSerialized = gqlSerializeGame(initialState);

  await Promise.all([
    publishGameChange(ctx, initialState._id, initialState, {
      updateExpiration: true,
    }),
    ctx.redis.lpush(getGamesKey(gameType), initialState._id),
    !isPrivate &&
      ctx.pubsub.publish(getGameCreatedKey(gameType), {
        newOngoingGame: gqlSerialized,
      }),
    ctx.redis.set(getUserGameKey(ctx.user._id.toString()), initialState._id),
  ]);

  return gqlSerialized;
});

export default createGame;
