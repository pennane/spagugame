import { TServiceHandler } from "../services.models";
import { Message } from "../../graphql/generated/graphql";
import { MESSAGES_KEY, MESSAGE_ADDED_KEY } from "./models";

const create: TServiceHandler<{ content: string }, Message> = async (
  ctx,
  { content }
) => {
  const messageAdded = { content };
  ctx.redis.lpush(MESSAGES_KEY, content);
  ctx.pubsub.publish(MESSAGE_ADDED_KEY, { messageAdded });
  return messageAdded;
};

export default create;
