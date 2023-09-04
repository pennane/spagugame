import { FC } from 'react'
import { OngoingGame, OngoingGameProcessState } from '../../../types'
import styled from 'styled-components'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { Button } from '../../../components/Button'
import {
  useJoinGameMutation,
  useToggleReadyMutation
} from '../../graphql/OngoingGame.generated'
import { GameFragment } from '../../../routes/LandingPage/graphql/Games.generated'

const StyledActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 3rem;
  border: 1px solid ${({ theme }) => theme.colors.foreground.info};
  border-radius: 0.25rem;
  padding: 0.5rem;
  justify-content: space-around;
`

const StyledAction = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`

type ActionsProps = {
  ongoingGame: OngoingGame
  game: GameFragment
}

export const Actions: FC<ActionsProps> = ({ ongoingGame, game }) => {
  const [toggleReady] = useToggleReadyMutation()
  const [joinGame] = useJoinGameMutation()

  const currentUser = useCurrentUser()
  if (!currentUser) return <StyledActions />

  if (ongoingGame.processState !== OngoingGameProcessState.NotStarted)
    return <StyledActions />

  const gamePlayer = ongoingGame.players.find(
    (player) => player.userId === currentUser._id
  )

  const canTakeNewPlayers =
    ongoingGame.processState === OngoingGameProcessState.NotStarted &&
    game?.maxPlayers &&
    game.maxPlayers > ongoingGame.players.length

  const hasJoined = !!gamePlayer

  const canJoin = canTakeNewPlayers && !hasJoined
  console.log(hasJoined)

  const handleToggleReady = async () => {
    toggleReady({
      variables: { ongoingGameId: ongoingGame._id, ready: !gamePlayer?.ready }
    })
  }

  const handleJoinGame = () => {
    if (!ongoingGame._id) return
    joinGame({ variables: { ongoingGameId: ongoingGame._id } })
  }

  return (
    <StyledActions>
      {canJoin && (
        <StyledAction>
          <Button onClick={handleJoinGame}>Join game</Button>
        </StyledAction>
      )}
      {hasJoined && (
        <StyledAction>
          <Button onClick={handleToggleReady}>
            Toggle ready {!gamePlayer.ready ? '✅' : '❌'}
          </Button>
        </StyledAction>
      )}
    </StyledActions>
  )
}
