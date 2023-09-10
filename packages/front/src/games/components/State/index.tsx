import { FC, useMemo } from 'react'

import { OngoingGame, OngoingGameProcessState } from '../../../types'
import { GAME_TYPE_TO_SPECIFICATION } from '../../constants'
import styled from 'styled-components'
import { isNotNil } from 'ramda'
import { GameSpecification } from '../../models'
import { useWinnersQuery } from './graphql/Winners.generated'
import { MiniProfileImage } from '../Players'

type GameRenderedProps = {
  game: OngoingGame
  playMove: (move: string) => void
}

const StyledState = styled.div`
  position: relative;
  width: fit-content;
  align-self: center;
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

const StyledWinners = styled.div`
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 80%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #5299d3;
  overflow: hidden;
  line-height: 1;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
`

const Winner = styled.div`
  display: flex;
  gap: 0.25rem;
  justify-content: center;
  align-items: center;
`

export const State: FC<GameRenderedProps> = ({ game, playMove }) => {
  const gameType = game.gameType
  const jsonState = game.jsonState
  const startsIn = game.startsIn

  const specification = useMemo(
    () => GAME_TYPE_TO_SPECIFICATION[gameType] as GameSpecification<unknown>,
    [gameType]
  )

  const { data: winnersData } = useWinnersQuery({
    variables: { userIds: game.winnerIds! },
    skip: !game.winnerIds || game.winnerIds.length === 0
  })

  const deserializedState = useMemo(() => {
    return specification.parseState(jsonState)
  }, [specification, jsonState])

  if (!deserializedState) throw new Error('Failed to deserialize state')

  const State = useMemo(
    () => specification.renderState(deserializedState, playMove),
    [specification, deserializedState, playMove]
  )

  const hasWinner = game.winnerIds && game.winnerIds.length > 0

  return (
    <StyledState>
      {State}
      {hasWinner && game.processState === OngoingGameProcessState.Finished && (
        <StyledWinners>
          Winner
          {winnersData &&
            winnersData.users.map((u) => (
              <Winner>
                <MiniProfileImage githubId={u.githubId} /> {u?.userName}
              </Winner>
            ))}
        </StyledWinners>
      )}
      {!hasWinner && game.processState === OngoingGameProcessState.Finished && (
        <StyledGameFinished>{'Game finished'}</StyledGameFinished>
      )}
      {isNotNil(startsIn) &&
        game.processState === OngoingGameProcessState.Starting && (
          <StyledStartsIn>{startsIn}</StyledStartsIn>
        )}
    </StyledState>
  )
}
