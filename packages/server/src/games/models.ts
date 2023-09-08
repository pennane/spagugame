import { ObjectId } from "mongodb";
import {
  OngoingGame,
  OngoingGamePlayer,
  GameType,
} from "../graphql/generated/graphql";
import { TickTackToeSpecification } from "./TickTackToe/TickTackToe";
import { FindFourSpecification } from "./FindFour/FindFour";

type InitialStateOptions = {
  isPrivate: boolean;
};

export type GameSpecification<T> = {
  _id: ObjectId;
  name: string;
  description: string;
  type: GameType;
  maxPlayers: number;
  minPlayers: number;
  initialState: (options: InitialStateOptions) => DeserializedGame<T>;
  nextState: (state: DeserializedGame<T>, move: string) => DeserializedGame<T>;
  canStart: (state: DeserializedGame<any>) => boolean;
  validateState: (data: unknown) => data is T;
};

export const GAME_SPECIFICATIONS_MAP = {
  [GameType.TickTackToe]: TickTackToeSpecification,
  [GameType.FindFour]: FindFourSpecification,
} satisfies Record<GameType, GameSpecification<any>>;

export type GqlSerializedGame = Omit<OngoingGame, "jsonState"> & {
  jsonState: string;
};
export type SerializedGame = Omit<OngoingGame, "jsonState" | "players"> & {
  jsonState: string;
  players: string;
};
export type DeserializedGame<T> = Omit<OngoingGame, "jsonState" | "players"> & {
  jsonState: T;
  players: OngoingGamePlayer[];
};
