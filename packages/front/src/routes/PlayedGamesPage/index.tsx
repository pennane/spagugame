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
import { MOBILE_WIDTHS, useIsMobile } from '../../hooks/useIsMobile'
import { EloChange } from '../ProfilePage/components/EloChange'
import { dateToFinnishLocale, parseDate } from '../../lib/date'

const StyledPlayedGamesPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const StyledVs = styled.span`
  margin: 0 0.25rem;
  text-transform: uppercase;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.foreground.warning};
`

const StyledPlayers = styled(Pill)`
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
  text-align: center;
  /* color: ${({ theme }) => theme.colors.foreground.secondary}; */
`

const StyledPlayedGame = styled.div`
  border-bottom: 1px solid #ff5666;
  padding: 0.75rem 0;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 3fr 1fr 1fr 1fr;
  gap: 0.5rem;
  justify-content: flex-start;
  align-items: center;
  justify-items: flex-start;

  @media (max-width: ${MOBILE_WIDTHS.default}px) {
    grid-auto-columns: 3fr 1fr 1fr;
  }
`
export const PlayedGame: FC<{
  game: PlayedGamesQuery['playedGames'][number]
  profilePage?: boolean
  eloChange?: number
}> = ({ game, profilePage, eloChange }) => {
  const isMobile = useIsMobile()

  return (
    <StyledPlayedGame key={game._id}>
      {profilePage && <P.DefaultText>{game.gameType}</P.DefaultText>}
      {!profilePage && (
        <StyledPlayers color="invertedSecondary">
          {game.players.map((plyer, i) => [
            i > 0 && <StyledVs>vs</StyledVs>,
            <span>{plyer.userName}</span>
          ])}
        </StyledPlayers>
      )}
      {!isMobile && (
        <Pill color="invertedSecondary">
          {dateToFinnishLocale(parseDate(game.finishedAt))}
        </Pill>
      )}

      {profilePage && <EloChange eloChange={eloChange} />}
      {!profilePage && (
        <Pill color="success">
          Avg. elo{' '}
          {Math.round(
            game.playerElosBefore.reduce((acc, elo) => acc + elo, 0) /
              game.players.length
          )}
        </Pill>
      )}

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
    [GameType.FindFour]: usePlayedGamesQuery({
      variables: { gameType: GameType.FindFour },
      skip: parsedGameType && parsedGameType !== GameType.FindFour
    }),
    [GameType.ColorFlood]: usePlayedGamesQuery({
      variables: { gameType: GameType.ColorFlood },
      skip: parsedGameType && parsedGameType !== GameType.ColorFlood
    }),
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
