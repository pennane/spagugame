import { FC } from 'react'
import { OngoingGame, User } from '../../../types'
import styled from 'styled-components'
import {
  OngoingGamePlayerProfileFragment,
  OngoingGameUserStatsFragment,
  useGamePlayerProfilesQuery
} from './graphql/GamePlayerProfiles.generated'

type PlayersProps = {
  game: OngoingGame
}

const StyledPlayers = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledPlayer = styled.div``

type MergedUser = Partial<
  User & OngoingGamePlayerProfileFragment & OngoingGameUserStatsFragment
>

export const Players: FC<PlayersProps> = ({ game }) => {
  const { data } = useGamePlayerProfilesQuery({
    variables: {
      gameType: game.gameType,
      userIds: game.players.map((player) => player.userId)
    }
  })

  const users = (
    !data
      ? game.players
      : game.players.map((player) => ({
          ...player,
          ...data.users.find((user) => user._id === player.userId),
          ...data.usersStats.find(
            (userStats) => userStats._id === player.userId
          )
        }))
  ) as MergedUser[]

  const currentTurnPlayerId = game.currentTurn

  return (
    <StyledPlayers>
      {users.map((player) => (
        <StyledPlayer key={player.userId}>
          {player.userName || player.userId}{' '}
          {player.elo ? `(${player.elo}) ` : ''}
          {player.userId === currentTurnPlayerId && '⚡'}
        </StyledPlayer>
      ))}
    </StyledPlayers>
  )
}
