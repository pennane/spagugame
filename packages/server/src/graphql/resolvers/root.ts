import { TGlobalContext, getGlobalContext } from "../../infrastructure/context";
import { MESSAGE_ADDED_KEY } from "../../services/message/models";
import { Resolvers } from "../generated/graphql";

export const resolvers: Resolvers<TGlobalContext> = {
  Query: {
    messages: (_root, _args, ctx) => ctx.services.message.getAll(ctx),
  },
  Subscription: {
    messageAdded: {
      subscribe: async () => {
        const ctx = await getGlobalContext();
        return {
          [Symbol.asyncIterator]: () =>
            ctx.pubsub.asyncIterator(MESSAGE_ADDED_KEY),
        };
      },
    },
  },
  Mutation: {
    addMessage: (_root, { content }: { content: string }, ctx) =>
      ctx.services.message.create(ctx, { content }),
  },
};
