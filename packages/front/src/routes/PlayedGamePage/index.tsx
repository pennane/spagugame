import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Heading } from '../../components/Heading'
import { P } from '../../components/P'
import styled from 'styled-components'
import { usePlayedGamePagePlayedGameQuery } from './graphql/PlayedGamePage.generated'

import { PlayedGamePlayer } from './components/PlayedGamePlayer'
import { dateToFinnishLocale, parseDate } from '../../lib/date'

const StyledPlayedGamePage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const PlayedGamePage: FC = () => {
  const { gameType, gameId } = useParams()
  const { data, loading } = usePlayedGamePagePlayedGameQuery({
    variables: { id: gameId! },
    skip: !gameId
  })
  if (loading) return <P.DefaultText>Loading...</P.DefaultText>
  const game = data?.playedGame
  if (!game) return <P.DefaultText>Game not found</P.DefaultText>

  const players = game.playerIds
    .map((id, index) => ({
      id,
      eloBefore: game.playerElosBefore[index],
      eloAfter: game.playerElosAfter[index],
      score: game.playerScores[index]
    }))
    .sort((a, b) => b.score - a.score)

  return (
    <StyledPlayedGamePage>
      <Heading.H1 style={{ wordBreak: 'break-word' }}>
        {gameType} played game
      </Heading.H1>
      <Heading.H3 style={{ wordBreak: 'break-word' }}>{gameId}</Heading.H3>
      <P.DefaultText>
        Played at {dateToFinnishLocale(parseDate(game.finishedAt))}
      </P.DefaultText>
      <Heading.H2>Players</Heading.H2>
      {players.map((player) => (
        <PlayedGamePlayer key={player.id} player={player} />
      ))}
    </StyledPlayedGamePage>
  )
}
