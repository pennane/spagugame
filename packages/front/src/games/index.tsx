import { FC } from 'react'
import {
  useGetOngoingGameQuery,
  useJoinGameMutation,
  usePlayMoveMutation
} from './graphql/OngoingGame.generated'
import { Players } from './components/Players'
import { State } from './components/State'
import { useGameQuery } from '../routes/GamePage/graphql/Game.generated'
import { OngoingGameProcessState } from '../types'
import { Button } from '../components/Button'
import { useCurrentUser } from '../hooks/useCurrentUser'

type GameRenderedProps = {
  ongoingGameId: string | undefined
}
export const RenderedGame: FC<GameRenderedProps> = ({ ongoingGameId }) => {
  const currentUser = useCurrentUser()
  const { data: ongoingGameData, loading: ongoingGameLoading } =
    useGetOngoingGameQuery({
      variables: { ongoingGameId: ongoingGameId! },
      skip: !ongoingGameId
    })
  const ongoingGame = ongoingGameData?.ongoingGame
  const { data: gameData } = useGameQuery({
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    variables: { gameType: ongoingGame?.gameType! },
    skip: !ongoingGame?.gameType
  })

  const [joinGame] = useJoinGameMutation()
  const [playMove] = usePlayMoveMutation()

  const handleJoinGame = () => {
    if (!ongoingGameId) return
    joinGame({ variables: { ongoingGameId } })
  }

  const handlePlayMove = (move: string) => {
    if (!ongoingGameId) return
    playMove({ variables: { ongoingGameId, move } })
  }

  const game = gameData?.game

  if (ongoingGameLoading) return <div>loading...</div>

  if (!ongoingGame) return <div>Game does not exist or has ended already</div>

  return (
    <>
      {!currentUser && <div>Log in to join</div>}
      {currentUser &&
        ongoingGame.processState === OngoingGameProcessState.NotStarted &&
        game?.maxPlayers &&
        game.maxPlayers > ongoingGame.players.length &&
        ongoingGame.players.every((p) => p.userId !== currentUser._id) && (
          <Button onClick={handleJoinGame}>Join</Button>
        )}
      <Players game={ongoingGame} />
      <State game={ongoingGame} playMove={handlePlayMove} />
    </>
  )
}
