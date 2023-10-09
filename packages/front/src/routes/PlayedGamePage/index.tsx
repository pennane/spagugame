import { FC, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Heading } from '../../components/Heading'
import { P } from '../../components/P'
import styled from 'styled-components'
import { usePlayedGamePagePlayedGameQuery } from './graphql/PlayedGamePage.generated'

import { PlayedGamePlayer } from './components/PlayedGamePlayer'
import { dateToFinnishLocale, parseDate } from '../../lib/date'

import { GAME_TYPE_TO_SPECIFICATION } from '../../games/constants'
import { GameType } from '../../types'

const StyledPlayedGamePage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const StyledStateWrapper = styled.div`
  align-self: flex-start;
`

const OldState: FC<{ state?: string; gameType: GameType }> = ({
  state,
  gameType
}) => {
  const rendered = useMemo(
    () =>
      state &&
      GAME_TYPE_TO_SPECIFICATION[gameType].renderState(
        GAME_TYPE_TO_SPECIFICATION[gameType].parseState(state) as any,
        () => {}
      ),
    [gameType, state]
  )

  if (!rendered) return null

  return <StyledStateWrapper>{rendered}</StyledStateWrapper>
}

export const PlayedGamePage: FC = () => {
  const { gameType, gameId } = useParams()
  const { data, loading } = usePlayedGamePagePlayedGameQuery({
    variables: { id: gameId! },
    skip: !gameId
  })

  if (loading) return <P.DefaultText>Loading...</P.DefaultText>
  const game = data?.playedGame
  if (!game) return <P.DefaultText>Game not found</P.DefaultText>

  const players = game.players
    .map((player, index) => ({
      ...player,
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
      {game.finalState && (
        <OldState gameType={game.gameType} state={game.finalState} />
      )}
      <Heading.H2>Players</Heading.H2>
      {players.map((player) => (
        <PlayedGamePlayer key={player._id} player={player} />
      ))}
    </StyledPlayedGamePage>
  )
}
