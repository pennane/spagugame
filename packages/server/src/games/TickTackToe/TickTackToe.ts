import { randomUUID } from "crypto";
import {
  GameType,
  OngoingGameProcessState,
} from "../../graphql/generated/graphql";
import { GameSettings } from "../models";

export type TickTackToeState = [
  [null | "o" | "x", null | "o" | "x", null | "o" | "x"],
  [null | "o" | "x", null | "o" | "x", null | "o" | "x"],
  [null | "o" | "x", null | "o" | "x", null | "o" | "x"]
];

export const TickTackToeSettings: GameSettings<TickTackToeState> = {
  type: GameType.TickTackToe,
  maxPlayers: 2,
  minPlayers: 2,
  validateState: (d): d is TickTackToeState => {
    if (!Array.isArray(d)) return false;
    if (!d[0] || !d[1] || !d[2]) return false;
    if (!Array.isArray(d[0]) || !Array.isArray(d[1]) || !Array.isArray(d[2]))
      return false;

    return d.every(
      (y) =>
        y.length === 3 &&
        y.every((v: unknown) => v === "o" || v === "x" || v === null)
    );
  },
  initialState: function () {
    return {
      _id: randomUUID(),
      gameType: GameType.TickTackToe,
      processState: OngoingGameProcessState.NotStarted,
      players: [],
      jsonState: Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => null)
      ) as TickTackToeState,
    };
  },
  canStart: function (s) {
    return (
      s.players.length >= this.minPlayers &&
      s.players.length <= this.maxPlayers &&
      s.processState === OngoingGameProcessState.NotStarted
    );
  },
  nextState: function (state, move) {
    if (state.processState !== OngoingGameProcessState.Ongoing)
      throw new Error("Invalid process state");
    if (!state.jsonState)
      throw new Error("MUST MAVE JSON STATE WHEN CHECKING NEXT STATE");
    const [x, y] = move.split("").map((s) => parseInt(s));
    if (state.jsonState?.[x]?.[y] !== null) {
      return state;
    }

    const currentPlayerIndex = state.players.findIndex(
      (p) => p.userId === state.currentTurn
    );

    state.jsonState[x][y] = currentPlayerIndex === 0 ? "x" : "o";

    const nextUp =
      state.players[currentPlayerIndex + (1 % state.players.length)].userId;

    state.currentTurn = nextUp;

    return state;
  },
};
