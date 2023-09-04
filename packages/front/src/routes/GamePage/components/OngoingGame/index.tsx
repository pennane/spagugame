import { FC } from 'react'
import { OngoingGame } from '../../../../types'

import { GameFragment } from '../../../LandingPage/graphql/Games.generated'
import { Button } from '../../../../components/Button'
import { CustomLink } from '../../../../components/CustomLink'

type OngoingGameItemProps = {
  ongoingGame: Pick<OngoingGame, '_id'> & {
    players: Pick<OngoingGame['players'][number], 'userId'>[]
  }
  game: GameFragment
}

export const OngoingGameItem: FC<OngoingGameItemProps> = ({
  ongoingGame,
  game
}) => {
  return (
    <CustomLink
      key={ongoingGame._id}
      to={`/game/${game.type}/${ongoingGame._id}`}
    >
      <Button color="info">
        {game.name} ({ongoingGame.players.length} / {game.maxPlayers} players)
      </Button>
    </CustomLink>
  )
}
