import { FC } from 'react'
import { Navigate } from 'react-router-dom'

import {
  GetOngoingGameDocument,
  useGetOngoingGameQuery,
  usePlayMoveMutation,
  useSubscribeOngoingGameSubscription
} from './graphql/OngoingGame.generated'
import { Players } from './components/Players'
import { State } from './components/State'
import { useGameQuery } from '../routes/GamePage/graphql/Game.generated'
import { filter, isNotNil, omit } from 'ramda'
import { Actions } from './components/Actions'
import styled from 'styled-components'
import { P } from '../components/P'
import { MOBILE_WIDTHS } from '../hooks/useIsMobile'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { isGameType } from '../lib/schema'
import { GameType } from '../types'
import { usePlayedGamePagePlayedGameByOldIdQuery } from '../routes/PlayedGamePage/graphql/PlayedGamePage.generated'

const StyledGame = styled.div`
  display: flex;
  gap: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.foreground.info};
  border-radius: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  padding: 2rem;
  @media (max-width: ${MOBILE_WIDTHS.default}px) {
    flex-direction: column;
  }
`

const StyledGameLeft = styled.div`
  width: 15rem;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`

const StyledGameRight = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  flex: 1;
`

type GameRenderedProps = {
  ongoingGameId: string | undefined
  gameType: string | undefined
}
export const RenderedGame: FC<GameRenderedProps> = ({
  ongoingGameId,
  gameType
}) => {
  const currentUser = useCurrentUser()

  const { data: ongoingGameData, loading: ongoingGameLoading } =
    useGetOngoingGameQuery({
      variables: { ongoingGameId: ongoingGameId! },
      skip: !ongoingGameId
    })

  const ongoingGame = ongoingGameData?.ongoingGame

  const { data: gameData, loading: gameLoading } = useGameQuery({
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    variables: { gameType: gameType as GameType },
    skip: !isGameType(gameType)
  })

  const { data: endedGameData } = usePlayedGamePagePlayedGameByOldIdQuery({
    variables: { ongoingGameId: ongoingGameId! },
    skip: ongoingGameLoading || !!ongoingGame || !ongoingGameId
  })

  const game = gameData?.game

  useSubscribeOngoingGameSubscription({
    variables: { ongoingGameId: ongoingGameId! },
    skip: !ongoingGameId,
    onData: ({ client, data }) => {
      const game = data.data?.ongoingGameStateChange
      if (!game || !ongoingGame?._id) return

      const updatedFields = omit(['_id', '__typename'], filter(isNotNil, game))

      client.cache.updateQuery(
        {
          query: GetOngoingGameDocument,
          variables: { ongoingGameId: ongoingGame?._id }
        },
        (data) => {
          const merged = { ...data.ongoingGame, ...updatedFields }
          return { ongoingGame: merged }
        }
      )
    }
  })

  const [playMove] = usePlayMoveMutation()

  const handlePlayMove = (move: string) => {
    if (!ongoingGameId) {
      return
    }

    if (ongoingGame?.currentTurn !== currentUser?._id) {
      return
    }
    playMove({ variables: { ongoingGameId, move } })
  }

  if (ongoingGameLoading || gameLoading)
    return <P.DefaultText>loading ...</P.DefaultText>

  if (endedGameData?.playedGame?._id)
    return (
      <Navigate to={`/played/${gameType}/${endedGameData?.playedGame?._id}`} />
    )

  if (!ongoingGame || !game)
    return (
      <P.DefaultText>Game does not exist or has ended already</P.DefaultText>
    )

  return (
    <StyledGame>
      <StyledGameLeft>
        <Players game={ongoingGame} />
      </StyledGameLeft>
      <StyledGameRight>
        <State game={ongoingGame} playMove={handlePlayMove} />
        <Actions ongoingGame={ongoingGame} game={game} />
      </StyledGameRight>
    </StyledGame>
  )
}
