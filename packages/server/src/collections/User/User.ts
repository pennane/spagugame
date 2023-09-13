import { ObjectId } from "mongodb";
import { User } from "../../graphql/generated/graphql";
import { CollectionSettings } from "../models";

export interface IUser
  extends Omit<User, "_id" | "achievements" | "followers" | "following"> {
  _id: ObjectId;
  achievementIds: string[];
  followerIds: string[];
  followingIds: string[];
}

export const USER_COLLECTION_SETTINGS: CollectionSettings<IUser> = {
  name: "users",
  collectionGetter: function (db) {
    return db.collection(this.name);
  },
  indexSpecs: [],
};
