import {
  WHITE,
  BLACK,
  PAWN,
  KNIGHT,
  BISHOP,
  ROOK,
  QUEEN,
  KING,
  Color,
  Piece,
  ChessPiece,
} from 'chess-core'

import blackKnight from './assets/SHAKKI_MUSTA_RATSU.svg'
import blackKing from './assets/SHAKKI_MUSTA_KUNINGAS.svg'
import blackQueen from './assets/SHAKKI_MUSTA_KUNINGATAR.svg'
import blackRook from './assets/SHAKKI_MUSTA_TORNI.svg'
import blackBishop from './assets/SHAKKI_MUSTA_LAHETTI.svg'
import blackPawn from './assets/SHAKKI_MUSTA_SOTILAS.svg'
import whiteKnight from './assets/SHAKKI_VALKONE_RATSU.svg'
import whiteKing from './assets/SHAKKI_VALKONE_KUNINGAS.svg'
import whiteQueen from './assets/SHAKKI_VALKONE_KUNINGATAR.svg'
import whiteRook from './assets/SHAKKI_VALKONE_TORNI.svg'
import whiteBishop from './assets/SHAKKI_VALKONE_LAHETTI.svg'
import whitePawn from './assets/SHAKKI_VALKONE_SOTILAS.svg'

const PIECE_TO_IMAGE_MAP: Record<`${Color}-${Piece}`, string> = {
  [`${WHITE}-${PAWN}`]: whitePawn,
  [`${WHITE}-${KNIGHT}`]: whiteKnight,
  [`${WHITE}-${BISHOP}`]: whiteBishop,
  [`${WHITE}-${ROOK}`]: whiteRook,
  [`${WHITE}-${QUEEN}`]: whiteQueen,
  [`${WHITE}-${KING}`]: whiteKing,
  [`${BLACK}-${PAWN}`]: blackPawn,
  [`${BLACK}-${KNIGHT}`]: blackKnight,
  [`${BLACK}-${BISHOP}`]: blackBishop,
  [`${BLACK}-${ROOK}`]: blackRook,
  [`${BLACK}-${QUEEN}`]: blackQueen,
  [`${BLACK}-${KING}`]: blackKing,
}

export function chessPieceToImageSrc(piece: ChessPiece): string {
  return PIECE_TO_IMAGE_MAP[`${piece.color}-${piece.type}`]
}
