import styled from 'styled-components'
import { GameSpecification } from '../../models'

type Cell = '1' | '2' | null
export type FindFourState = Cell[][]

const validateState = (state: unknown): state is FindFourState => {
  if (!Array.isArray(state)) return false
  if (state.length < 4) return false
  if (!state.every(Array.isArray)) return false

  if (
    !state.every((row) =>
      row.every(
        (cell: any): cell is Cell =>
          cell === null || cell === '1' || cell === '2'
      )
    )
  ) {
    return false
  }
  return true
}

const parseState = (serializedState: string): FindFourState | null => {
  try {
    const state = JSON.parse(serializedState)
    if (!validateState(state)) return null
    return state
  } catch {
    return null
  }
}

const StyledTable = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  padding: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border-radius: 0.5rem;
`
const StyledRow = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledCircle = styled.div<{ $cell: Cell }>`
  background-color: ${({ $cell, theme }) => {
    if ($cell === '1') return theme.colors.foreground.danger
    if ($cell === '2') return theme.colors.foreground.info
    return theme.colors.background.secondary
  }};

  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;

  ${({ $cell, theme }) =>
    $cell &&
    `border: 10px ridge ${
      $cell === '1'
        ? theme.colors.foreground.danger
        : theme.colors.foreground.info
    } ;`}
`

const StyledEmptyCell = styled.div<{ $cell: Cell }>`
  height: 2.5rem;
  width: 2.5rem;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  display: flex;
  justify-content: center;
  align-items: center;
  outline: 1px solid ${({ theme }) => theme.colors.background.secondary};

  cursor: ${({ $cell }) => ($cell ? 'initial' : 'pointer')};
`

const renderState = (
  state: FindFourState,
  playMove: (move: string) => void
) => {
  return (
    <StyledTable>
      {state.map((row, x) => (
        <StyledRow key={x} onClick={() => playMove(String(x))}>
          {row.map((cell, y) => (
            <StyledEmptyCell $cell={cell} key={y}>
              <StyledCircle $cell={cell} />
            </StyledEmptyCell>
          ))}
        </StyledRow>
      ))}
    </StyledTable>
  )
}

const MiniCircle = styled(StyledCircle)`
  height: 1.25rem;
  width: 1.25rem;
`

const getPlayerIdentifier = (index: number) => (
  <MiniCircle $cell={index === 0 ? '1' : '2'} />
)

export const FindFour: GameSpecification<FindFourState> = {
  validateState,
  parseState,
  renderState,
  getPlayerIdentifier
}
