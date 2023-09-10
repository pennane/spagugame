import { randomUUID } from "crypto";
import * as R from "ramda";
import {
  GameType,
  OngoingGameProcessState,
} from "../../graphql/generated/graphql";
import { GameSpecification } from "../models";
import { mongoIdFromSeed } from "../../lib/mongo";
import { randomIntBetweenInclusive } from "../../lib/common";

const WIDTH = 27;
const HEIGHT = 27;
const COLORS = ["1", "2", "3", "4", "5"] as const;
type Color = (typeof COLORS)[number];
type Cell = `${number},${number}`;

type Board = Color[][];
type PlayerState = {
  cells: Cell[];
  color: Color;
};

export type ColorFloodState = {
  player1: PlayerState;
  player2: PlayerState;
  totalCellCount: number;
  board: Board;
};

const parseColor = (color: string): Color | null => {
  if (!COLORS.includes(color as Color)) {
    return null;
  }
  return color as Color;
};

const checkWinner = (board: ColorFloodState): "1" | "2" | "-" | null => {
  if (board.player1.cells.length > board.totalCellCount / 2) {
    return "1";
  }
  if (board.player2.cells.length > board.totalCellCount / 2) {
    return "2";
  }
  if (
    board.player1.cells.length + board.player2.cells.length ===
    board.totalCellCount
  ) {
    return "-";
  }
  return null;
};

const adjacentCells = (cell: Cell, color: Color, grid: Board): Cell[] => {
  const [x, y] = cell.split(",").map((n) => parseInt(n, 10));
  return [
    [x, y - 1],
    [x + 1, y],
    [x, y + 1],
    [x - 1, y],
  ].flatMap(([x, y]) =>
    grid?.[x]?.[y] === color ? [`${x},${y}` as Cell] : []
  );
};

const flood = (
  playerState: PlayerState,
  board: Board
): { playerState: PlayerState; board: Board } => {
  console.log("flood");

  // Flood cells adjacent to player cells that have the same color as the player
  const color = playerState.color;

  const newRegion: Set<Cell> = new Set(playerState.cells);

  for (const cell of [...newRegion.values()]) {
    console.log("checking cell", cell);

    for (const adjacent of adjacentCells(cell, color, board)) {
      if (newRegion.has(adjacent)) continue;
      newRegion.add(adjacent);
    }
  }
  console.log("flood2");

  let i = 0;
  const traverseAdjacents = (perimiter: Set<Cell>) => {
    i++;
    if (i > 100) throw new Error("too many iterations");
    const adjacents = new Set<Cell>();
    for (const cell of [...perimiter.values()]) {
      console.log("checking cell", cell);
      for (const adjacent of adjacentCells(cell, color, board)) {
        if (newRegion.has(adjacent)) continue;

        adjacents.add(adjacent);
        newRegion.add(adjacent);
      }
    }
    if (adjacents.size > 0) {
      console.log("traversing further asdf with size of ", adjacents.size);

      traverseAdjacents(new Set<Cell>(adjacents));
    }
  };
  traverseAdjacents(newRegion);
  console.log("flood3");

  const newBoard = R.clone(board);
  for (const cell of newRegion.values()) {
    const [x, y] = cell.split(",").map((n) => parseInt(n, 10));
    newBoard[x][y] = color;
  }
  console.log("flood4");

  return {
    playerState: {
      cells: Array.from(newRegion.values()),
      color,
    },
    board: newBoard,
  };
};

const createInitialJsonState = (): ColorFloodState => {
  const board: Color[][] = Array.from({ length: WIDTH }, () =>
    Array.from(
      { length: HEIGHT },
      () => randomIntBetweenInclusive(1, 5).toString(10) as Color
    )
  );

  const player1Cells: Cell[] = [`${0},${0}`];

  const player2Cells: Cell[] = [`${WIDTH - 1},${HEIGHT - 1}`];

  const { playerState: player1State, board: board1 } = flood(
    { cells: player1Cells, color: board[0][0] },
    board
  );
  const { playerState: player2State, board: board2 } = flood(
    { cells: player2Cells, color: board[WIDTH - 1][HEIGHT - 1] },
    board1
  );

  return {
    board: board2,
    totalCellCount: WIDTH * HEIGHT,
    player1: player1State,
    player2: player2State,
  };
};

export const ColorFloodSpecification: GameSpecification<ColorFloodState> = {
  _id: mongoIdFromSeed("color flood"),
  name: "Color Flood",
  description:
    "a game where where two players try to flood the board by choosing new colors. Player who first floods more than half of the board wins. Homage to the classic Värivaltaus from Aapeli.",
  type: GameType.ColorFlood,
  maxPlayers: 2,
  minPlayers: 2,
  validateState: (d): d is ColorFloodState => {
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
      gameType: GameType.ColorFlood,
      processState: OngoingGameProcessState.NotStarted,
      players: [],
      jsonState: createInitialJsonState(),
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

    const color = parseColor(move);

    if (!color) {
      throw new Error("Invalid color");
    }

    if (
      state.jsonState.player1.color === color ||
      state.jsonState.player2.color === color
    ) {
      throw new Error("Cannot play the same color as the other player");
    }

    const newState = R.clone(state);

    const currentPlayerIndex = newState.players.findIndex(
      (p) => p.userId === newState.currentTurn
    );
    console.log(JSON.stringify(newState.jsonState.player1.cells));
    console.log(JSON.stringify(newState.jsonState.player2.cells));
    const playerNumber = currentPlayerIndex === 0 ? "1" : "2";

    const playerState = newState.jsonState[`player${playerNumber}`];

    playerState.color = color;

    const { playerState: newPlayerState, board: newBoard } = flood(
      playerState,
      newState.jsonState.board
    );

    newState.jsonState.board = newBoard;
    newState.jsonState[`player${playerNumber}`] = newPlayerState;

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
