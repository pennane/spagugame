import styled from 'styled-components'
import { GameSpecification } from '../../models'

const COLORS = ['1', '2', '3', '4', '5'] as const
type Color = (typeof COLORS)[number]
type Cell = [number, number]

type Board = Color[][]
type PlayerState = {
  cells: Cell[]
  color: Color
}

export type ColorFloodState = {
  player1: PlayerState
  player2: PlayerState
  totalCellCount: number
  board: Board
}

const validateState = (state: unknown): state is ColorFloodState => {
  if (typeof state !== 'object' || state === null) return false
  if (!('player1' in state)) return false
  if (!('player2' in state)) return false
  if (!('totalCellCount' in state)) return false
  if (!('board' in state)) return false
  return true
}

const parseState = (state: string): ColorFloodState | null => {
  try {
    const parsed = JSON.parse(state)
    if (!validateState(parsed)) null
    return parsed
  } catch {
    return null
  }
}

const StyledState = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StyledTable = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledRow = styled.div`
  display: flex;
`

const StyledColor = styled.div<{ $color: string }>`
  width: 0.5rem;
  height: 0.5rem;
  background-color: ${({ $color }) => $color};
`

const StyledPickColors = styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  padding: 0.5rem;
  justify-content: center;
  align-items: center;
`
const StyledPickColor = styled.div<{ $color: string; $disabled: boolean }>`
  background-color: ${({ $color }) => $color};
  opacity: ${({ $disabled }) => ($disabled ? 0.1 : 1)};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  border: 1px solid ${({ theme }) => theme.colors.foreground.primary};
  width: 1.5rem;
  height: 1.5rem;
`

const getColorValue = (color: Color): string => {
  switch (color) {
    case '1':
      return 'red'
    case '2':
      return 'green'
    case '3':
      return 'blue'
    case '4':
      return 'yellow'
    case '5':
      return 'purple'
    default:
      return 'black'
  }
}

const renderState = (
  state: ColorFloodState,
  playMove: (move: string) => void
) => {
  return (
    <StyledState>
      <StyledTable>
        {state.board.map((row, i) => (
          <StyledRow key={i}>
            {row.map((color, j) => (
              <StyledColor key={j} $color={getColorValue(color)} />
            ))}
          </StyledRow>
        ))}
      </StyledTable>
      <StyledPickColors>
        {COLORS.map((color) => (
          <StyledPickColor
            key={color}
            $disabled={
              state.player1.color === color || state.player2.color === color
            }
            $color={getColorValue(color)}
            onClick={() => playMove(color)}
          />
        ))}
      </StyledPickColors>
    </StyledState>
  )
}

export const ColorFlood: GameSpecification<ColorFloodState> = {
  validateState,
  parseState,
  renderState
}
