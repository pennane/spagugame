import { randomUUID } from "crypto";
import * as R from "ramda";
import {
  GameType,
  OngoingGameProcessState,
} from "../../graphql/generated/graphql";
import { GameSpecification } from "../models";
import { mongoIdFromSeed } from "../../lib/mongo";

export type TickTackToeState = [
  [null | "o" | "x", null | "o" | "x", null | "o" | "x"],
  [null | "o" | "x", null | "o" | "x", null | "o" | "x"],
  [null | "o" | "x", null | "o" | "x", null | "o" | "x"]
];

const checkWinner = (board: TickTackToeState) => {
  for (let row = 0; row < 3; row++) {
    if (
      board[row][0] &&
      board[row][0] === board[row][1] &&
      board[row][1] === board[row][2]
    ) {
      return board[row][0];
    }
  }

  // Check columns
  for (let col = 0; col < 3; col++) {
    if (
      board[0][col] &&
      board[0][col] === board[1][col] &&
      board[1][col] === board[2][col]
    ) {
      return board[0][col];
    }
  }

  // Check diagonals
  if (
    board[0][0] &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    return board[0][0];
  }
  if (
    board[0][2] &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    return board[0][2];
  }

  // Check for a draw
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        return null; // Game is still ongoing
      }
    }
  }

  // If we've reached here, it's a draw
  return "-";
};

export const TickTackToeSpecification: GameSpecification<TickTackToeState> = {
  _id: mongoIdFromSeed("tick tack toe"),
  name: "Tick tack toe",
  description:
    "a game for two players who take turns marking the spaces in a three-by-three grid with X or O. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row is the winner.",
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
      throw new Error("MUST HAVE JSON STATE WHEN CHECKING NEXT STATE");
    const [x, y] = move.split("").map((s) => parseInt(s));
    console.log(
      x,
      y,
      state.jsonState?.[x]?.[y],
      state.jsonState,
      typeof state.jsonState
    );
    if (state.jsonState?.[x]?.[y] !== null) {
      throw new Error("Cannot place piece over old placement");
    }

    const newState = R.clone(state);

    const currentPlayerIndex = newState.players.findIndex(
      (p) => p.userId === newState.currentTurn
    );

    console.log("userIndex", currentPlayerIndex);

    const playerSymbol = currentPlayerIndex === 0 ? "x" : "o";

    newState.jsonState[x][y] = playerSymbol;

    const winner = checkWinner(newState.jsonState);

    if (!winner) {
      const nextUp =
        newState.players[(currentPlayerIndex + 1) % state.players.length]
          .userId;

      newState.currentTurn = nextUp;

      return newState;
    }

    newState.currentTurn = null;
    newState.processState = OngoingGameProcessState.Finished;

    if (winner === "-") {
      return newState;
    }

    newState.players[currentPlayerIndex].score = 100;

    return newState;
  },
};
