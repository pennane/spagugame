import { FC, useMemo } from 'react'

import { OngoingGame, OngoingGameProcessState } from '../../../types'
import { GAME_TYPE_TO_SPECIFICATION } from '../../constants'
import styled from 'styled-components'
import { isNotNil } from 'ramda'

type GameRenderedProps = {
  game: OngoingGame
  playMove: (move: string) => void
}

const StyledState = styled.div`
  position: relative;
  width: fit-content;
`

const StyledStartsIn = styled.div`
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.foreground.danger};
  font-weight: 900;
  font-size: 6rem;
`
const StyledGameFinished = styled.div`
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 80%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.foreground.info};
  font-weight: 900;
  font-size: 2.5rem;
  overflow: hidden;
  line-height: 1;
  text-align: center;
`

export const State: FC<GameRenderedProps> = ({ game, playMove }) => {
  const gameType = game.gameType
  const jsonState = game.jsonState
  const startsIn = game.startsIn

  const specification = useMemo(
    () => GAME_TYPE_TO_SPECIFICATION[gameType],
    [gameType]
  )

  const deserializedState = useMemo(() => {
    return specification.parseState(jsonState)
  }, [specification, jsonState])

  if (!deserializedState) throw new Error('Failed to deserialize state')

  const State = useMemo(
    () => specification.renderState(deserializedState, playMove),
    [specification, deserializedState, playMove]
  )

  return (
    <StyledState>
      {State}
      {game.processState === OngoingGameProcessState.Finished && (
        <StyledGameFinished>{'Game finished'}</StyledGameFinished>
      )}
      {isNotNil(startsIn) &&
        game.processState === OngoingGameProcessState.Starting && (
          <StyledStartsIn>{startsIn}</StyledStartsIn>
        )}
    </StyledState>
  )
}
