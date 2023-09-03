import * as R from "ramda";
import { ObjectId } from "mongodb";
import { Game } from "../graphql/generated/graphql";
import { CollectionSettings } from "./models";
import { TickTackToeSpecification } from "../games/TickTackToe/TickTackToe";

export interface IGame extends Omit<Game, "_id" | "ongoingGameIds"> {
  _id: ObjectId;
}

const seedDocuments: IGame[] = [TickTackToeSpecification].map(
  R.pick(["name", "description", "type", "_id"])
);

export const GAME_COLLECTION_SETTINGS: CollectionSettings<IGame> = {
  name: "games",
  collectionGetter: function (db) {
    return db.collection(this.name);
  },
  indexSpecs: [
    {
      specification: { type: 1 },
      options: { unique: true, name: "type_unique" },
    },
  ],
  seedDocuments,
};
