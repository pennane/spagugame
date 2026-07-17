import { Color as ChessColor } from 'chess-core'
import { GameSpecification } from '../../models'
import { ChessBoard } from './ChessBoard'

type ChessGameState = {
  fen: string
  colorAssignment: Record<string, ChessColor>
}

const validateState = (state: unknown): state is ChessGameState => {
  if (typeof state !== 'object' || state === null) return false
  if (!('fen' in state) || typeof (state as any).fen !== 'string') return false
  if (
    !('colorAssignment' in state) ||
    typeof (state as any).colorAssignment !== 'object'
  )
    return false
  return true
}

const parseState = (serializedState: string): ChessGameState | null => {
  try {
    const state = JSON.parse(serializedState)
    if (!validateState(state)) return null
    return state
  } catch {
    return null
  }
}

const renderState = (
  state: ChessGameState,
  playMove: (move: string) => void
) => {
  return <ChessBoard state={state} playMove={playMove} />
}

const getPlayerIdentifier = (index: number) => (index === 0 ? '♔' : '♚')

export const Chess: GameSpecification<ChessGameState> = {
  validateState,
  parseState,
  renderState,
  getPlayerIdentifier,
}
