import { FC } from 'react'

import {
  GetOngoingGameDocument,
  useGetOngoingGameQuery,
  useJoinGameMutation,
  usePlayMoveMutation,
  useSubscribeOngoingGameSubscription
} from './graphql/OngoingGame.generated'
import { Players } from './components/Players'
import { State } from './components/State'
import { useGameQuery } from '../routes/GamePage/graphql/Game.generated'
import { OngoingGameProcessState } from '../types'
import { Button } from '../components/Button'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { filter, isNotNil, omit } from 'ramda'
import { Actions } from './components/Actions'

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
  console.log(ongoingGameId)

  useSubscribeOngoingGameSubscription({
    variables: { ongoingGameId: ongoingGameId! },
    skip: !ongoingGameId,
    onSubscriptionComplete: () => {
      console.log('subi ok')
    },
    onError: (e) => {
      console.error('subi error', e)
    },
    onComplete: () => {
      console.log('subi complete')
    },
    onSubscriptionData: () => {
      console.log('on data')
    },
    onData: ({ client, data }) => {
      const game = data.data?.ongoingGameStateChange
      console.log('new data')
      if (!game || !ongoingGame?._id) return

      const updatedFields = omit(['_id', '__typename'], filter(isNotNil, game))

      client.cache.updateQuery(
        {
          query: GetOngoingGameDocument,
          variables: { ongoingGameId: ongoingGame?._id }
        },
        (data) => {
          console.log('merging', updatedFields)

          const merged = { ...data.ongoingGame, ...updatedFields }
          return { ongoingGame: merged }
        }
      )
    }
  })

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

  const canTakeNewPlayers =
    ongoingGame.processState === OngoingGameProcessState.NotStarted &&
    game?.maxPlayers &&
    game.maxPlayers > ongoingGame.players.length

  return (
    <>
      {!currentUser && canTakeNewPlayers && <div>Log in to join</div>}
      {currentUser &&
        canTakeNewPlayers &&
        ongoingGame.players.every((p) => p.userId !== currentUser._id) && (
          <Button onClick={handleJoinGame}>Join</Button>
        )}
      <Players game={ongoingGame} />
      <State game={ongoingGame} playMove={handlePlayMove} />
      <Actions game={ongoingGame} />
    </>
  )
}
