import { FC } from 'react'
import styled from 'styled-components'

import { LeaderboardsLeaderboardFragment } from '../../graphql/Leaderboards.generated'
import { Heading } from '../../../../components/Heading'

import { GameLeaderboardPlayer } from './components/GameLeaderboardPlayer'

const StyledGameLeaderboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const StyledGameLeaderboardPlayers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

type GameLeaderboardProps = {
  leaderboard: LeaderboardsLeaderboardFragment
}

export const GameLeaderboard: FC<GameLeaderboardProps> = ({ leaderboard }) => {
  return (
    <StyledGameLeaderboard>
      <Heading.H2>{leaderboard.gameType}</Heading.H2>
      <StyledGameLeaderboardPlayers>
        {leaderboard.players.map((player, i) => (
          <GameLeaderboardPlayer
            key={player._id}
            player={player}
            rank={i + 1}
          />
        ))}
      </StyledGameLeaderboardPlayers>
    </StyledGameLeaderboard>
  )
}
