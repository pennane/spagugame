import { FC, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import {
  fenToState,
  generateLegalMovesForSquareIndex,
  serializeMove,
  indexToSquare,
  CHESS_BOARD_SIZE,
  Color as ChessColor,
  Move,
} from 'chess-core'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { chessPieceToImageSrc } from './lib'

type ChessGameState = {
  fen: string
  colorAssignment: Record<string, ChessColor>
}

const StyledBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: fit-content;
  border: 2px solid ${({ theme }) => theme.colors.foreground.info};
`

const StyledSquare = styled.div<{
  $light: boolean
  $selected: boolean
  $legalTarget: boolean
}>`
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  background-color: ${({ $light, $selected, theme }) =>
    $selected
      ? theme.colors.foreground.info + '80'
      : $light
        ? '#e8d4b0'
        : '#b08860'};

  &::after {
    content: '';
    display: ${({ $legalTarget }) => ($legalTarget ? 'block' : 'none')};
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.25);
    position: absolute;
  }
`

const StyledPieceImg = styled.img`
  width: 2.25rem;
  height: 2.25rem;
  pointer-events: none;
  user-select: none;
`

export const ChessBoard: FC<{
  state: ChessGameState
  playMove: (move: string) => void
}> = ({ state, playMove }) => {
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null)
  const currentUser = useCurrentUser()

  const chessState = useMemo(() => fenToState(state.fen), [state.fen])

  const isFlipped = useMemo(() => {
    if (!currentUser || Object.keys(state.colorAssignment).length === 0)
      return false
    return state.colorAssignment[currentUser._id] === 'b'
  }, [currentUser, state.colorAssignment])

  const legalMoves = useMemo(() => {
    if (selectedSquare === null) return []
    return generateLegalMovesForSquareIndex(chessState, selectedSquare)
  }, [chessState, selectedSquare])

  const legalTargets = useMemo(
    () => new Set(legalMoves.map((m) => m.to)),
    [legalMoves]
  )

  const handleSquareClick = useCallback(
    (squareIndex: number) => {
      if (selectedSquare === null) {
        const piece = chessState.board[squareIndex]
        if (piece && piece.color === chessState.sideToMove) {
          setSelectedSquare(squareIndex)
        }
        return
      }

      const move = legalMoves.find((m) => m.to === squareIndex)
      if (move) {
        // Auto-promote to queen for promotion moves
        let moveToPlay: Move = move
        if (move.kind === 'normal') {
          const promotionMove = legalMoves.find(
            (m) =>
              m.to === squareIndex && m.kind === 'promotion' && m.promotion === 'q'
          )
          if (promotionMove) moveToPlay = promotionMove
        }
        playMove(serializeMove(moveToPlay))
        setSelectedSquare(null)
      } else {
        const piece = chessState.board[squareIndex]
        if (piece && piece.color === chessState.sideToMove) {
          setSelectedSquare(squareIndex)
        } else {
          setSelectedSquare(null)
        }
      }
    },
    [selectedSquare, chessState, legalMoves, playMove]
  )

  const squares = []
  for (let displayRank = 7; displayRank >= 0; displayRank--) {
    for (let displayFile = 0; displayFile < CHESS_BOARD_SIZE; displayFile++) {
      const rank = isFlipped ? 7 - displayRank : displayRank
      const file = isFlipped ? 7 - displayFile : displayFile
      const squareIndex = rank * CHESS_BOARD_SIZE + file
      const piece = chessState.board[squareIndex]
      const { rank: sqRank, file: sqFile } = indexToSquare(squareIndex)
      const isLight = (sqRank + sqFile) % 2 !== 0
      const isSelected = selectedSquare === squareIndex
      const isLegalTarget = legalTargets.has(squareIndex)

      squares.push(
        <StyledSquare
          key={squareIndex}
          $light={isLight}
          $selected={isSelected}
          $legalTarget={isLegalTarget && !piece}
          onClick={() => handleSquareClick(squareIndex)}
        >
          {piece && <StyledPieceImg src={chessPieceToImageSrc(piece)} />}
          {isLegalTarget && piece && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                border: '3px solid rgba(0,0,0,0.25)',
                borderRadius: '50%',
              }}
            />
          )}
        </StyledSquare>
      )
    }
  }

  return <StyledBoard>{squares}</StyledBoard>
}
