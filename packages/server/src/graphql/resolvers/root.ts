import { ObjectId } from "mongodb";
import { get } from "../../collections/lib";
import { TContext } from "../../infrastructure/context";
import createGame from "../../services/ongoingGame/createGame";
import joinGame from "../../services/ongoingGame/joinGame";
import {
  getGameFromRedis,
  gqlSerializeGame,
} from "../../services/ongoingGame/lib/serialize";
import { Resolvers } from "../generated/graphql";
import { dateScalar } from "../scalars/Date/Date";
import playTurn from "../../services/ongoingGame/playTurn";

export const resolvers: Resolvers<TContext> = {
  Date: dateScalar,
  Query: {
    currentUser: async (_root, _args, ctx) => {
      if (!ctx.user?._id) return null;
      try {
        const user = (await get(ctx, "user", {
          filter: { _id: new ObjectId(ctx.user._id) },
        })) as any;
        if (user) return user;
      } catch {
        return null;
      }
    },
    user: async (_root, { id }, ctx) => {
      try {
        const user = (await get(ctx, "user", {
          filter: { _id: new ObjectId(id) },
        })) as any;
        if (user) return user;
      } catch {
        return null;
      }
    },
    ongoingGame: async (_root, { ongoingGameId }, ctx) => {
      const game = await getGameFromRedis(ctx, ongoingGameId);
      if (!game) throw new Error("Invalid game id");
      return gqlSerializeGame(game);
    },
  },
  Subscription: {
    ongoingGameStateChange: {
      subscribe: async (_root, { ongoingGameId }, ctx) => {
        return {
          [Symbol.asyncIterator]: () =>
            ctx.pubsub.asyncIterator(`game_changed.${ongoingGameId}`),
        };
      },
    },
  },
  Mutation: {
    createOngoingGame: async (_root, { gameType }, ctx) =>
      createGame(ctx, { gameType }),
    joinOngoingGame: async (_root, { ongoingGameId }, ctx) =>
      joinGame(ctx, { gameId: ongoingGameId }),
    playTurn: async (_root, { json, ongoingGameId }, ctx) =>
      playTurn(ctx, { gameId: ongoingGameId, json }),
  },
};
