import * as R from "ramda";
import {
  OngoingGame,
  OngoingGameProcessState,
} from "../../graphql/generated/graphql";

import { authenticatedService } from "../lib";

import { gqlSerializeGame } from "./lib/serialize";
import {
  getGameFromRedis,
  getUserGameKey,
  publishGameChange,
  removeGameFromRedis,
} from "./lib/publish";
import { isEmpty } from "ramda";
import finishGame from "./finishGame";

const leaveGame = authenticatedService<{ gameId: string }, OngoingGame>(
  async (ctx, { gameId }) => {
    const game = await getGameFromRedis(ctx, gameId);
    if (!game) throw new Error("Game does not exist");

    const inTheGame = game.players.find(
      (p) => p.userId === ctx.user._id.toString()
    );

    if (!inTheGame) {
      throw new Error("User not in the game to begin with");
    }

    if (game.processState === OngoingGameProcessState.Ongoing) {
      return await finishGame(ctx, {
        game: R.modify(
          "players",
          (players) =>
            players.map((p) =>
              p.userId === inTheGame.userId
                ? p
                : R.modify("score", (s) => s + 100, p)
            ),
          game
        ),
      });
    }

    const newPlayers = game.players.filter(
      (p) => p.userId !== ctx.user._id.toString()
    );

    if (isEmpty(newPlayers)) {
      await removeGameFromRedis(ctx, game._id, game.gameType);
      return gqlSerializeGame({
        ...game,
        players: [],
        processState: OngoingGameProcessState.Finished,
      });
    }

    await Promise.all([
      ctx.redis.del(getUserGameKey(ctx.user._id.toString())),
      publishGameChange(
        ctx,
        game._id,
        { players: newPlayers },
        { updateExpiration: true }
      ),
    ]);

    return gqlSerializeGame((await getGameFromRedis(ctx, game._id))!);
  }
);

export default leaveGame;
