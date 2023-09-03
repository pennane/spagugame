import { FC } from 'react'
import { OngoingGame, OngoingGameProcessState } from '../../../types'
import styled from 'styled-components'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { Button } from '../../../components/Button'
import { useToggleReadyMutation } from '../../graphql/OngoingGame.generated'

const StyledActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
const StyledAction = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`

type ActionsProps = {
  game: OngoingGame
}

export const Actions: FC<ActionsProps> = ({ game }) => {
  const [toggleReady] = useToggleReadyMutation()

  console.log(1)
  const currentUser = useCurrentUser()
  if (!currentUser) return null
  console.log(2, game.processState)
  if (game.processState !== OngoingGameProcessState.NotStarted) return null
  console.log(3)
  const gamePlayer = game.players.find(
    (player) => player.userId === currentUser._id
  )

  if (!gamePlayer) return null
  console.log(4)

  const handleToggleReady = async () => {
    toggleReady({
      variables: { ongoingGameId: game._id, ready: !gamePlayer?.ready }
    })
  }

  return (
    <StyledActions>
      <StyledAction>
        <Button onClick={handleToggleReady}>Toggle ready</Button>
        {gamePlayer.ready ? '✅' : '❌'}
      </StyledAction>
    </StyledActions>
  )
}
