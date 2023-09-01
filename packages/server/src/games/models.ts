import {
  OngoingGame,
  OngoingGamePlayer,
  GameType,
} from "../graphql/generated/graphql";
import { TickTackToeSettings } from "./TickTackToe/TickTackToe";

export interface GameSettings<T> {
  type: GameType;
  maxPlayers: number;
  minPlayers: number;
  initialState: () => DeserializedGame<T>;
  nextState: (state: DeserializedGame<T>, move: string) => DeserializedGame<T>;
  canStart: (state: DeserializedGame<any>) => boolean;
  validateState: (data: unknown) => data is T;
}

export const GAME_SETTINGS_MAP = {
  [GameType.TickTackToe]: TickTackToeSettings,
} satisfies Record<GameType, GameSettings<any>>;

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
