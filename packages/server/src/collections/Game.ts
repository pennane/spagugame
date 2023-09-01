import { ObjectId } from "mongodb";
import { Game } from "../graphql/generated/graphql";
import { CollectionSettings } from "./models";

export interface IGame extends Omit<Game, "_id"> {
  _id: ObjectId;
}

export const GAME_COLLECTION_SETTINGS: CollectionSettings<IGame> = {
  name: "games",
  collectionGetter: function (db) {
    return db.collection(this.name);
  },
  indexSpecs: [],
};
