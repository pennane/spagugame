import { OngoingGame } from "../../graphql/generated/graphql";

import { authenticatedService } from "../lib";
import { DeserializedGame } from "../../games/models";
import { gqlSerializeGame } from "./lib/serialize";

const finishGame = authenticatedService<
  { game: DeserializedGame<unknown> },
  OngoingGame
>(async (ctx, { game }) => {
  // remove from redis

  // save to mongo

  // update elo

  // return final state
  return gqlSerializeGame(game);
});

export default finishGame;
