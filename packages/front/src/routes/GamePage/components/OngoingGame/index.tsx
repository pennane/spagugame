import { FC } from 'react'
import { OngoingGame } from '../../../../types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { GameFragment } from '../../../LandingPage/graphql/Games.generated'
import { Button } from '../../../../components/Button'

type OngoingGameItemProps = {
  ongoingGame: Pick<OngoingGame, '_id'> & {
    players: Pick<OngoingGame['players'][number], 'userId'>[]
  }
  game: GameFragment
}

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    color: inherit;
    text-decoration: none;
  }
`

export const OngoingGameItem: FC<OngoingGameItemProps> = ({
  ongoingGame,
  game
}) => {
  return (
    <StyledLink
      key={ongoingGame._id}
      to={`/game/${game.type}/${ongoingGame._id}`}
    >
      <Button color="info">
        {game.name} ({ongoingGame.players.length} / {game.maxPlayers} players)
      </Button>
    </StyledLink>
  )
}
