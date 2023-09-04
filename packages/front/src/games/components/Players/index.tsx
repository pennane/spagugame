import { FC } from 'react'
import {
  OngoingGame,
  OngoingGamePlayer,
  OngoingGameProcessState
} from '../../../types'
import styled from 'styled-components'
import {
  OngoingGamePlayerProfileFragment,
  OngoingGameUserStatsFragment,
  useGamePlayerProfilesQuery
} from './graphql/GamePlayerProfiles.generated'
import { Span } from '../../../components/Span'

type PlayersProps = {
  game: OngoingGame
}

const StyledPlayers = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledPlayer = styled.div``

type MergedUser = Partial<
  OngoingGamePlayer &
    OngoingGamePlayerProfileFragment &
    OngoingGameUserStatsFragment
>

export const Players: FC<PlayersProps> = ({ game }) => {
  const { data } = useGamePlayerProfilesQuery({
    variables: {
      gameType: game.gameType,
      userIds: game.players.map((player) => player.userId)
    }
  })

  const dataUsers = data?.users
  const dataUserStats = data?.usersStats

  const users = (
    !dataUsers || !dataUserStats
      ? game.players
      : game.players.map((player) => ({
          ...player,
          ...dataUsers.find((user) => user._id === player.userId),
          ...dataUserStats.find((userStats) => userStats._id === player.userId)
        }))
  ) as MergedUser[]

  const currentTurnPlayerId = game.currentTurn

  const showReadyState =
    game.processState === OngoingGameProcessState.NotStarted ||
    game.processState === OngoingGameProcessState.Starting

  return (
    <StyledPlayers>
      {users.map((player) => (
        <StyledPlayer key={player.userId}>
          <Span.SmallText color="inverted">
            {player.userName || player.userId}{' '}
            {player.elo ? `(${player.elo})` : ''}
          </Span.SmallText>
          <Span.SmallText>
            {' '}
            {player.userId === currentTurnPlayerId && '⚡'}
          </Span.SmallText>
          <Span.SmallText>
            {showReadyState && (player.ready ? '✅' : '❌')}
          </Span.SmallText>
        </StyledPlayer>
      ))}
    </StyledPlayers>
  )
}
