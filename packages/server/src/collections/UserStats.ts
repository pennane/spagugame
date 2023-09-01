import { ObjectId } from "mongodb";
import { UserStats } from "../graphql/generated/graphql";
import { CollectionSettings } from "./models";

export interface IUserStats extends Omit<UserStats, "_id"> {
  _id: ObjectId;
}

export const USER_STATS_COLLECTION_SETTINGS: CollectionSettings<IUserStats> = {
  name: "userStats",
  collectionGetter: function (db) {
    return db.collection(this.name);
  },
  indexSpecs: [],
};
