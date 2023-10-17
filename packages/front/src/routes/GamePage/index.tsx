import styled from 'styled-components'
import { useGameQuery, useNewGameMutation } from './graphql/Game.generated'
import { useNavigate, useParams } from 'react-router-dom'
import { GameType, OngoingGameProcessState } from '../../types'
import { Button } from '../../components/Button'
import { Heading } from '../../components/Heading'
import { P } from '../../components/P'
import { toast } from 'react-toastify'

import { Pill } from '../../components/Pill'
import { OngoingGameItem } from './components/OngoingGame'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { isGameType } from '../../lib/schema'
import { theme } from '../../theme'
import { useSubscribeGameTypeOngoingGames } from '../../hooks/useSubscribeNewOngoingGames'
import { Modal } from '../../components/Modal'
import { useLeaveGameMutation } from '../../games/graphql/OngoingGame.generated'
import { useState } from 'react'
import { useUserOngoingGameIdQuery } from '../../games/components/Actions/graphql/UserOngoingGameId.generated'

const StyledGamePage = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.foreground.danger};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 10rem;
`

const StyledGameDescription = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
const StyledGameActions = styled.section`
  display: flex;
  flex-wrap: wrap;

  gap: 0.5rem;
`

const StyledGameOngoingGames = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const GamePage = () => {
  const currentUser = useCurrentUser()
  const navigate = useNavigate()

  const { gameType: rawGameType } = useParams()
  const gameType = isGameType(rawGameType) ? rawGameType : undefined

  useSubscribeGameTypeOngoingGames({ gameType: gameType!, skip: !gameType })

  const { data, loading } = useGameQuery({
    variables: { gameType: gameType as GameType },
    skip: !gameType,
    pollInterval: 10000
  })

  const [createNewGame] = useNewGameMutation()
  const [showAlreadyJoinedModal, setShowAlreadyJoinedModal] = useState(false)

  const {
    data: alreadyOngoingGameIdData,
    loading: alreadyOngoingGameIdLoading
  } = useUserOngoingGameIdQuery({ fetchPolicy: 'network-only' })

  const alreadyOngoingGameId =
    alreadyOngoingGameIdData?.currentUser?.ongoingGameId

  const handleCreateNewGame = (isPrivate: boolean) => {
    if (!gameType) return
    createNewGame({ variables: { gameType, private: isPrivate } })
      .then((res) => {
        res.data?.createOngoingGame._id &&
          navigate(`/game/${gameType}/${res.data.createOngoingGame._id}`)
      })
      .catch((e) => {
        if (
          e?.message ===
            'Cannot join multiple games at the same time. Leave old game first' &&
          alreadyOngoingGameId
        ) {
          setShowAlreadyJoinedModal(true)
        } else {
          toast(e?.message || 'error :(', { type: 'error' })
        }
      })
  }
  const [leaveGame] = useLeaveGameMutation()
  const handleLeaveGame = (id?: string | null) => {
    if (!id) return
    leaveGame({ variables: { ongoingGameId: id } })
  }

  if (loading || alreadyOngoingGameIdLoading)
    return <P.DefaultText>loading...</P.DefaultText>

  const game = data?.game

  if (!game) return <P.DefaultText>Game does not exist</P.DefaultText>

  const hasOngoingGames = game.ongoingGames.length > 0

  return (
    <StyledGamePage>
      <StyledGameDescription>
        <Heading.H1>{game.name}</Heading.H1>

        {game.maxPlayers === game.minPlayers && (
          <Pill color="info">{game.maxPlayers} players</Pill>
        )}
        {game.maxPlayers !== game.minPlayers && (
          <Pill color="primary">{game.maxPlayers} players</Pill>
        )}

        <P.SmallText>{game.description}</P.SmallText>
      </StyledGameDescription>
      <StyledGameActions>
        {currentUser && (
          <Button onClick={() => handleCreateNewGame(false)}>
            Create new game
          </Button>
        )}
        {currentUser && (
          <Button onClick={() => handleCreateNewGame(true)}>
            Create{' '}
            <span style={{ color: theme.colors.foreground.warning }}>
              private game
            </span>{' '}
          </Button>
        )}
        {!currentUser && (
          <P.DefaultText>
            <b>You need to be logged in to create or join games</b>
          </P.DefaultText>
        )}
      </StyledGameActions>
      <StyledGameOngoingGames>
        <Heading.H2>Currently going games:</Heading.H2>
        {hasOngoingGames &&
          game.ongoingGames
            .filter(
              (g) =>
                !g.isPrivate &&
                g.processState !== OngoingGameProcessState.Finished
            )
            .map((ongoingGame) => (
              <OngoingGameItem
                key={ongoingGame._id}
                game={game}
                ongoingGame={ongoingGame}
                currentUser={currentUser}
              />
            ))}
        {!hasOngoingGames && (
          <P.DefaultText>
            No ongoing games. You could create one instead.
          </P.DefaultText>
        )}
      </StyledGameOngoingGames>
      <Modal
        title="Leave existing game"
        onConfirm={() => {
          handleLeaveGame(alreadyOngoingGameId)
          setShowAlreadyJoinedModal(false)
        }}
        onCancel={() => setShowAlreadyJoinedModal(false)}
        show={showAlreadyJoinedModal}
      >
        <P.DefaultText>
          You are already joined to a game. You can leave it to join a new one.
          When leaving a game that is already running you will lose elo
          equivalent to losing the game.
        </P.DefaultText>
      </Modal>
    </StyledGamePage>
  )
}
