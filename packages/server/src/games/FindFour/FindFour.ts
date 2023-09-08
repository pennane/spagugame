import { randomUUID } from "crypto";
import * as R from "ramda";
import {
  GameType,
  OngoingGameProcessState,
} from "../../graphql/generated/graphql";
import { GameSpecification } from "../models";
import { mongoIdFromSeed } from "../../lib/mongo";

type Cell = "1" | "2" | null;
export type FindFourState = Cell[][];
const WIDTH = 7;
const HEIGHT = 6;

const checkWinner = (board: FindFourState) => {
  const rows = board.length;
  const cols = board[0].length;

  // Check for 4 in a row horizontally
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 3; c++) {
      if (
        board[r][c] &&
        board[r][c] === board[r][c + 1] &&
        board[r][c] === board[r][c + 2] &&
        board[r][c] === board[r][c + 3]
      ) {
        return board[r][c];
      }
    }
  }

  // Check for 4 in a row vertically
  for (let r = 0; r < rows - 3; r++) {
    for (let c = 0; c < cols; c++) {
      if (
        board[r][c] &&
        board[r][c] === board[r + 1][c] &&
        board[r][c] === board[r + 2][c] &&
        board[r][c] === board[r + 3][c]
      ) {
        return board[r][c];
      }
    }
  }

  // Check for 4 in a row diagonally (bottom-left to top-right)
  for (let r = 3; r < rows; r++) {
    for (let c = 0; c < cols - 3; c++) {
      if (
        board[r][c] &&
        board[r][c] === board[r - 1][c + 1] &&
        board[r][c] === board[r - 2][c + 2] &&
        board[r][c] === board[r - 3][c + 3]
      ) {
        return board[r][c];
      }
    }
  }

  // Check for 4 in a row diagonally (top-left to bottom-right)
  for (let r = 0; r < rows - 3; r++) {
    for (let c = 0; c < cols - 3; c++) {
      if (
        board[r][c] &&
        board[r][c] === board[r + 1][c + 1] &&
        board[r][c] === board[r + 2][c + 2] &&
        board[r][c] === board[r + 3][c + 3]
      ) {
        return board[r][c];
      }
    }
  }

  // Check for tie
  if (board.every((r) => r.every((c) => c !== null))) return "-";

  return null;
};

export const FindFourSpecification: GameSpecification<FindFourState> = {
  _id: mongoIdFromSeed("find four"),
  name: "Find four",
  description:
    "a game where players drop discs from the top into a grid. The first to connect four discs consecutively, either vertically, horizontally, or diagonally, wins. Simple in design yet rich in strategy.",
  type: GameType.FindFour,
  maxPlayers: 2,
  minPlayers: 2,
  validateState: (d): d is FindFourState => {
    if (!Array.isArray(d)) return false;
    for (const x of R.range(0, WIDTH)) {
      for (const y of R.range(0, HEIGHT)) {
        const cell = d?.[x]?.[y];
        if (cell !== null && cell !== "1" && cell !== "2") {
          return false;
        }
      }
    }
    return true;
  },
  initialState: function (options) {
    return {
      _id: randomUUID(),
      gameType: GameType.FindFour,
      processState: OngoingGameProcessState.NotStarted,
      players: [],
      jsonState: Array.from({ length: WIDTH }, () =>
        Array.from({ length: HEIGHT }, () => null)
      ) as FindFourState,
      isPrivate: options.isPrivate,
    };
  },
  canStart: function (s) {
    return (
      s.players.every((p) => p.ready) &&
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
    const x = parseInt(move);

    if (!state.jsonState[x]) {
      throw new Error("Invalid move - outside of board");
    }
    console.log(state.jsonState, x, state.jsonState[x]);

    if (state.jsonState[x]?.[0] !== null) {
      throw new Error("Cannot place piece over old placement");
    }

    const newState = R.clone(state);

    const currentPlayerIndex = newState.players.findIndex(
      (p) => p.userId === newState.currentTurn
    );

    const playerSymbol = currentPlayerIndex === 0 ? "1" : "2";

    for (const y of R.range(0, HEIGHT).reverse()) {
      console.log("trying", y);

      if (newState.jsonState[x][y] === null) {
        console.log("setting to", x, y);

        newState.jsonState[x][y] = playerSymbol;
        break;
      }
    }

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
