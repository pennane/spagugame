import styled from 'styled-components'
import { Heading } from '../../components/Heading'
import { UserSearch } from './components/UserSearch'
import { GameLeaderboard } from './components/GameLeaderboard'
import { GameType } from '../../types'
import { P } from '../../components/P'
import { useLeaderboardsQuery } from './graphql/Leaderboards.generated'

const StyledLeaderboardPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const StyledGameLeaderboards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const LeaderboardPage = () => {
  const { data, loading } = useLeaderboardsQuery({
    variables: { gameTypes: Object.values(GameType) }
  })

  return (
    <StyledLeaderboardPage>
      <Heading.H1>Who da best playas?</Heading.H1>
      <Heading.H3>Search for users</Heading.H3>
      <UserSearch />
      <Heading.H2>Leaderboards</Heading.H2>
      <P.DefaultText>Best 10 players of every game</P.DefaultText>
      <StyledGameLeaderboards>
        {loading && <P.DefaultText>Leaderboards loading...</P.DefaultText>}
        {!loading &&
          data?.leaderboards.map((leaderboard) => (
            <GameLeaderboard
              key={leaderboard.gameType}
              leaderboard={leaderboard}
            />
          ))}
      </StyledGameLeaderboards>
      <P.SmallText>(leaderboards update once every 15 minutes)</P.SmallText>
    </StyledLeaderboardPage>
  )
}
