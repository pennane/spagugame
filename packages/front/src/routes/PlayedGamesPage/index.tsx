import { FC, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { Heading } from '../../components/Heading'

import styled from 'styled-components'
import {
  PlayedGamesQuery,
  usePlayedGamesQuery
} from './graphql/PlayedGamesPage.generated'
import { isGameType } from '../../lib/schema'
import { GameType } from '../../types'
import { Pill } from '../../components/Pill'
import { P } from '../../components/P'
import { CustomLink } from '../../components/CustomLink'

const StyledPlayedGamesPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const StyledPlayedGame = styled.div`
  border-bottom: 1px solid #ff5666;
  padding: 0.75rem 1rem;

  display: flex;
  gap: 0.5rem;
  justify-content: flex-start;
  align-items: center;
`
const PlayedGame: FC<{ game: PlayedGamesQuery['playedGames'][number] }> = ({
  game
}) => {
  return (
    <StyledPlayedGame key={game._id}>
      <P.DefaultText>{game.gameType}</P.DefaultText>
      <P.SmallText>({game._id})</P.SmallText>
      <Pill color="info">{game.playerIds.length} players</Pill>
      <Pill color="success">
        Average elo{' '}
        {Math.round(
          game.playerElosBefore.reduce((acc, elo) => acc + elo, 0) /
            game.playerIds.length
        )}
      </Pill>
      <CustomLink to={`/played/${game.gameType}/${game._id}`}>
        View game
      </CustomLink>
    </StyledPlayedGame>
  )
}

export const PlayedGamesPage: FC = () => {
  const { gameType } = useParams()
  const parsedGameType = isGameType(gameType) ? gameType : undefined

  const allData: Record<GameType, ReturnType<typeof usePlayedGamesQuery>> = {
    [GameType.TickTackToe]: usePlayedGamesQuery({
      variables: { gameType: GameType.TickTackToe },
      skip: parsedGameType && parsedGameType !== GameType.TickTackToe
    })
  }

  return (
    <StyledPlayedGamesPage>
      <Heading.H1>Recently completed matches</Heading.H1>
      {parsedGameType && (
        <>
          <Heading.H2>{parsedGameType}</Heading.H2>
          <div>
            {allData[parsedGameType].data?.playedGames.map((game) => (
              <PlayedGame key={game._id} game={game} />
            ))}
          </div>
        </>
      )}
      {!parsedGameType &&
        Object.entries(allData).map(([gameType, response]) => (
          <Fragment key={gameType}>
            <Heading.H2>{gameType}</Heading.H2>
            {response.data?.playedGames.slice(0, 7).map((game) => (
              <PlayedGame key={game._id} game={game} />
            ))}
          </Fragment>
        ))}
    </StyledPlayedGamesPage>
  )
}
