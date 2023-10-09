import { ObjectId } from "mongodb";
import { PlayedGame } from "../../graphql/generated/graphql";
import { CollectionSettings } from "../models";

export interface IPlayedGame extends Omit<PlayedGame, "_id" | "players"> {
  _id: ObjectId;
}

export const PLAYED_GAME_COLLECTION_SETTINGS: CollectionSettings<IPlayedGame> =
  {
    name: "playedGames",
    collectionGetter: function (db) {
      return db.collection(this.name);
    },
    indexSpecs: [],
  };
