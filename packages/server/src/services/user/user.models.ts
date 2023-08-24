import { ObjectId } from "mongodb";
import { User } from "../../graphql/generated/graphql";

export enum EUserRole {
  user = "user",
  admin = "admin",
}

export interface IUser extends Omit<User, "_id"> {
  _id: ObjectId;
  githubId: string;
}
