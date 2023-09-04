import { FC } from 'react'
import { GamesQuery } from '../../routes/LandingPage/graphql/Games.generated'
import styled from 'styled-components'
import { OngoingGameProcessState } from '../../types'
import { Link } from 'react-router-dom'
import { Span } from '../Span'
import { Heading } from '../Heading'
import { theme } from '../../theme'

type GameBannerProps = {
  game: GamesQuery['games'][0]
}

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    color: inherit;
    text-decoration: none;
  }
`

const StyledGameBanner = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 20rem;

  /* background-color: ${({ theme }) => theme.colors.foreground.danger}; */
  border: 1px solid ${({ theme }) => theme.colors.foreground.danger};

  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 1rem;

  border-radius: 0.5rem;

  > * {
    margin: 0;
  }

  transition: background-color 0.05s ease;
`

const StyledGameBannerInfoText = styled(Span.SmallText)``

export const GameBanner: FC<GameBannerProps> = ({ game }) => {
  const joinableGames = game.ongoingGames.filter(
    (g) =>
      g.players.length < game.maxPlayers &&
      g.processState === OngoingGameProcessState.NotStarted
  )

  return (
    <StyledLink to={`/game/${game.type}`}>
      <StyledGameBanner>
        <Heading.H3 style={{ color: theme.colors.foreground.danger }}>
          {game.name}
        </Heading.H3>
        <Span.SmallText>{game.description}</Span.SmallText>
        <StyledGameBannerInfoText>
          {game.ongoingGames.length} ongoing games
        </StyledGameBannerInfoText>
        <StyledGameBannerInfoText>
          {joinableGames.length} games waiting for players
        </StyledGameBannerInfoText>
      </StyledGameBanner>
    </StyledLink>
  )
}
