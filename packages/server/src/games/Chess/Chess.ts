import { randomUUID } from "crypto";
import * as R from "ramda";
import {
  GameType,
  OngoingGameProcessState,
} from "../../graphql/generated/graphql";
import { GameSpecification } from "../models";
import { mongoIdFromSeed } from "../../lib/mongo";
import {
  fenToState,
  stateToFen,
  playMove as chessPlayMove,
  generateMoves,
  isInCheck,
  INITIAL_CHESS_BOARD_FEN_STRING,
  WHITE,
  Color as ChessColor,
} from "chess-core";

export type ChessGameState = {
  fen: string;
  colorAssignment: Record<string, ChessColor>;
};

export const ChessSpecification: GameSpecification<ChessGameState> = {
  _id: mongoIdFromSeed("chess"),
  name: "Chess",
  description:
    "the classic game of strategy where two players command armies of pieces on a checkered board. Checkmate your opponent's king to win.",
  type: GameType.Chess,
  maxPlayers: 2,
  minPlayers: 2,
  validateState: (d): d is ChessGameState => {
    if (typeof d !== "object" || d === null) return false;
    if (!("fen" in d) || typeof (d as any).fen !== "string") return false;
    if (
      !("colorAssignment" in d) ||
      typeof (d as any).colorAssignment !== "object"
    )
      return false;
    return true;
  },
  initialState: function (options) {
    return {
      _id: randomUUID(),
      gameType: GameType.Chess,
      processState: OngoingGameProcessState.NotStarted,
      players: [],
      jsonState: {
        fen: INITIAL_CHESS_BOARD_FEN_STRING,
        colorAssignment: {},
      },
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

    const newState = R.clone(state);

    // Assign colors on first move
    if (Object.keys(newState.jsonState.colorAssignment).length === 0) {
      const whitePlayer = newState.currentTurn!;
      const blackPlayer = newState.players.find(
        (p) => p.userId !== whitePlayer,
      )!.userId;
      newState.jsonState.colorAssignment = {
        [whitePlayer]: WHITE,
        [blackPlayer]: "b",
      };
    }

    const chessState = fenToState(newState.jsonState.fen);
    const playerColor =
      newState.jsonState.colorAssignment[newState.currentTurn!];
    if (playerColor !== chessState.sideToMove) {
      throw new Error("Not your turn");
    }

    const nextChessState = chessPlayMove(move, chessState);

    if (nextChessState === chessState) {
      throw new Error("Invalid move");
    }

    newState.jsonState.fen = stateToFen(nextChessState);

    const possibleMoves = generateMoves(nextChessState);

    if (possibleMoves.length === 0) {
      newState.currentTurn = null;
      newState.processState = OngoingGameProcessState.Finished;

      if (isInCheck(nextChessState)) {
        const currentPlayerIndex = newState.players.findIndex(
          (p) => p.userId === state.currentTurn,
        );
        newState.players[currentPlayerIndex].score = 100;
      }

      return newState;
    }

    const nextColor = nextChessState.sideToMove;
    const nextPlayerId = Object.entries(
      newState.jsonState.colorAssignment,
    ).find(([, color]) => color === nextColor)![0];
    newState.currentTurn = nextPlayerId;

    return newState;
  },
};
