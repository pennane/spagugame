import { TServiceHandler } from "../services.models";
import { Message } from "../../graphql/generated/graphql";
import { MESSAGES_KEY } from "./models";

const getAll: TServiceHandler<void, Message[]> = async (ctx) =>
  ctx.redis
    .lrange(MESSAGES_KEY, 0, -1)
    .then((v) => v.map((content) => ({ content })));

export default getAll;
