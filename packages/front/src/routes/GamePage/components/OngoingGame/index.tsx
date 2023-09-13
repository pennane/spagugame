import { FC } from 'react'
import { OngoingGame } from '../../../../types'

import { GameFragment } from '../../../LandingPage/graphql/Games.generated'
import { Button } from '../../../../components/Button'
import { CustomLink } from '../../../../components/CustomLink'
import { MiniProfileImage } from '../../../../games/components/Players'
import styled from 'styled-components'
import { ProfilePageUserFragment } from '../../../ProfilePage/graphql/ProfilePage.generated'

type OngoingGameItemProps = {
  ongoingGame: Pick<OngoingGame, '_id'> & {
    players: Pick<OngoingGame['players'][number], 'userId'>[]
  }
  game: GameFragment
  currentUser: ProfilePageUserFragment | null
}

const StyledMiniProfileImage = styled(MiniProfileImage)`
  display: inline-block;
  width: 1rem;
  height: 1rem;
`

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const OngoingGameItem: FC<OngoingGameItemProps> = ({
  ongoingGame,
  game,
  currentUser
}) => {
  return (
    <CustomLink
      key={ongoingGame._id}
      to={`/game/${game.type}/${ongoingGame._id}`}
    >
      <StyledButton color="info">
        {game.name} ({ongoingGame.players.length} / {game.maxPlayers} players)
        {currentUser &&
          ongoingGame.players.some((p) => p.userId === currentUser?._id) && (
            <StyledMiniProfileImage githubId={currentUser.githubId} />
          )}
      </StyledButton>
    </CustomLink>
  )
}
