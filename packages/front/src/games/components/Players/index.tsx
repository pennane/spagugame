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
import { Pill } from '../../../components/Pill'
import { ProfileImage } from '../../../routes/ProfilePage'

type PlayersProps = {
  game: OngoingGame
}

export const MiniProfileImage = styled(ProfileImage)`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 100%;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.background.secondary};
`

const PlayerHeaders = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 0.25rem;
  grid-template-columns: 2rem 8rem 1fr;
`

const StyledPlayers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const StyledPlayer = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 0.25rem;
  grid-template-columns: 2rem 8rem 1fr;
`

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

  const players = (
    !dataUsers || !dataUserStats
      ? game.players
      : game.players.map((player) => {
          const user = dataUsers.find((user) => user._id === player.userId)
          const stats = dataUserStats.find(
            (userStats) => userStats.userId === player.userId
          )
          return {
            ...player,
            ...user,
            ...stats
          }
        })
  ) as MergedUser[]

  const currentTurnPlayerId = game.currentTurn

  const showReadyState =
    game.processState === OngoingGameProcessState.NotStarted ||
    game.processState === OngoingGameProcessState.Starting

  return (
    <StyledPlayers>
      <PlayerHeaders>
        <Span.SmallText></Span.SmallText>
        <Span.SmallText>
          <b>Name</b>
        </Span.SmallText>
        <Span.SmallText>
          <b>Elo</b>
        </Span.SmallText>
        <Span.SmallText>
          <b>State</b>
        </Span.SmallText>
      </PlayerHeaders>
      {players.map((player) => (
        <StyledPlayer key={player.userId}>
          <MiniProfileImage githubId={player.githubId} />
          <Span.SmallText
            style={{
              width: '8rem',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            {player.userName || player.userId}{' '}
          </Span.SmallText>
          <Pill color="info">{player.elo}</Pill>
          <Span.SmallText>
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
