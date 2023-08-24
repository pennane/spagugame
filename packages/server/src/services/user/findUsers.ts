import { Filter, FindOptions } from "mongodb";
import { TServiceHandler } from "../services.models";
import { IUser } from "./user.models";

const findUsers: TServiceHandler<
  { filter: Filter<IUser>; options: FindOptions },
  IUser[]
> = async (ctx, { filter, options }) => {
  const users = await ctx.collections.user.find(filter, options).toArray();
  return users;
};

export default findUsers;
