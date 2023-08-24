import { TContext } from "../../infrastructure/context";
import createGame from "../../services/game/createGame";
import joinGame from "../../services/game/joinGame";
import { getGame, gqlSerializeGame } from "../../services/game/lib/serialize";
import { Resolvers } from "../generated/graphql";

export const resolvers: Resolvers<TContext> = {
  Query: {
    game: async (_root, { gameId }, ctx) => {
      const game = await getGame(ctx, gameId);
      if (!game) throw new Error("Invalid game id");
      return gqlSerializeGame(game);
    },
  },
  Subscription: {
    gameStateChange: {
      subscribe: async (_root, { gameId }, ctx) => {
        return {
          [Symbol.asyncIterator]: () =>
            ctx.pubsub.asyncIterator(`game_changed.${gameId}`),
        };
      },
    },
  },
  Mutation: {
    createGame: async (_root, { gameType }, ctx) =>
      createGame(ctx, { gameType }),
    joinGame: async (_root, { gameId }, ctx) => joinGame(ctx, { gameId }),
  },
};
