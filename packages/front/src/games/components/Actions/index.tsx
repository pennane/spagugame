import { FC, useState } from 'react'
import { OngoingGame, OngoingGameProcessState } from '../../../types'
import styled from 'styled-components'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { Button } from '../../../components/Button'
import {
  useJoinGameMutation,
  useLeaveGameMutation,
  useToggleReadyMutation
} from '../../graphql/OngoingGame.generated'
import { GameFragment } from '../../../routes/LandingPage/graphql/Games.generated'
import { Span } from '../../../components/Span'
import { Modal } from '../../../components/Modal'
import { P } from '../../../components/P'
import { CustomLink } from '../../../components/CustomLink'
import { useFindNewGame } from '../../../hooks/useFindNewGame'

const StyledActions = styled.div`
  display: flex;
  gap: 0.5rem;

  border: 1px solid ${({ theme }) => theme.colors.foreground.info};
  border-radius: 0.25rem;
  padding: 0.5rem;
  justify-content: space-around;
  width: fit-content;
  align-self: center;
  flex-wrap: wrap;
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
  const [leaveGame] = useLeaveGameMutation()
  const [findNewGame, searchingNewGame] = useFindNewGame(game.type)

  const [showModal, setShowModal] = useState(false)

  const currentUser = useCurrentUser()
  if (!currentUser)
    return (
      <StyledActions>
        <Span.DefaultText style={{ textAlign: 'center' }}>
          You are not logged in. Spectating.
        </Span.DefaultText>
      </StyledActions>
    )

  const gamePlayer = ongoingGame.players.find(
    (player) => player.userId === currentUser._id
  )

  const canTakeNewPlayers =
    ongoingGame.processState === OngoingGameProcessState.NotStarted &&
    game?.maxPlayers &&
    game.maxPlayers > ongoingGame.players.length

  const hasJoined = !!gamePlayer

  const canJoin = canTakeNewPlayers && !hasJoined

  const handleToggleReady = async () => {
    toggleReady({
      variables: { ongoingGameId: ongoingGame._id, ready: !gamePlayer?.ready }
    })
  }

  const handleJoinGame = () => {
    if (!ongoingGame._id) return
    joinGame({ variables: { ongoingGameId: ongoingGame._id } })
  }

  const handleLeaveGame = () => {
    if (!ongoingGame._id) return
    leaveGame({ variables: { ongoingGameId: ongoingGame._id } })
  }

  return (
    <StyledActions>
      {canJoin && (
        <StyledAction>
          <Button onClick={handleJoinGame}>Join game</Button>
        </StyledAction>
      )}
      {hasJoined &&
        ongoingGame.processState === OngoingGameProcessState.NotStarted && (
          <StyledAction>
            <Button onClick={handleToggleReady}>
              Toggle ready {!gamePlayer.ready ? '✅' : '❌'}
            </Button>
          </StyledAction>
        )}
      {hasJoined &&
        ongoingGame.processState !== OngoingGameProcessState.Finished && (
          <StyledAction>
            <Button onClick={() => setShowModal(true)}>Leave</Button>
          </StyledAction>
        )}
      {ongoingGame.playedGameId && (
        <StyledAction>
          <CustomLink
            to={`/played/${ongoingGame.gameType}/${ongoingGame.playedGameId}`}
          >
            <Button>View stats</Button>
          </CustomLink>
        </StyledAction>
      )}
      {ongoingGame.processState === OngoingGameProcessState.Finished && (
        <StyledAction>
          <Button disabled={searchingNewGame} onClick={findNewGame}>
            Find new game
          </Button>
        </StyledAction>
      )}
      <Modal
        title="Are you sure?"
        onConfirm={() => {
          handleLeaveGame()
          setShowModal(false)
        }}
        onCancel={() => setShowModal(false)}
        show={showModal}
      >
        <P.DefaultText>
          Are you sure you want to leave? If the game is running you will lose
          elo equivalent to losing the game.
        </P.DefaultText>
      </Modal>
    </StyledActions>
  )
}
