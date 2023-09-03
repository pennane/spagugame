import styled from 'styled-components'

export type TickTackToeState = [
  [null | 'o' | 'x', null | 'o' | 'x', null | 'o' | 'x'],
  [null | 'o' | 'x', null | 'o' | 'x', null | 'o' | 'x'],
  [null | 'o' | 'x', null | 'o' | 'x', null | 'o' | 'x']
]

const validateState = (state: unknown): state is TickTackToeState => {
  if (!Array.isArray(state)) return false
  if (state.length !== 3) return false
  if (!state.every((row) => Array.isArray(row))) return false
  if (!state.every((row) => row.length === 3)) return false
  if (
    !state.every((row) =>
      row.every((cell: any) => cell === null || cell === 'o' || cell === 'x')
    )
  )
    return false
  return true
}

const parseState = (serializedState: string): TickTackToeState | null => {
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
`
const StyledRow = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledCell = styled.div`
  height: 4rem;
  width: 4rem;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  text-transform: capitalize;
  font-weight: 900;

  &:empty {
    cursor: pointer;
  }

  &:not(:empty) {
    pointer-events: none;
    cursor: none;
  }
`

const renderState = (
  state: TickTackToeState,
  playMove: (move: string) => void
) => {
  return (
    <StyledTable>
      <StyledRow>
        <StyledCell onClick={() => playMove('00')}>{state[0][0]}</StyledCell>
        <StyledCell onClick={() => playMove('01')}>{state[0][1]}</StyledCell>
        <StyledCell onClick={() => playMove('02')}>{state[0][2]}</StyledCell>
      </StyledRow>
      <StyledRow>
        <StyledCell onClick={() => playMove('10')}>{state[1][0]}</StyledCell>
        <StyledCell onClick={() => playMove('11')}>{state[1][1]}</StyledCell>
        <StyledCell onClick={() => playMove('12')}>{state[1][2]}</StyledCell>
      </StyledRow>
      <StyledRow>
        <StyledCell onClick={() => playMove('20')}>{state[2][0]}</StyledCell>
        <StyledCell onClick={() => playMove('21')}>{state[2][1]}</StyledCell>
        <StyledCell onClick={() => playMove('22')}>{state[2][2]}</StyledCell>
      </StyledRow>
    </StyledTable>
  )
}

export const TickTackToe = { validateState, parseState, renderState }
