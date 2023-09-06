import { FC } from 'react'

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

const StyledGame = styled.div`
  display: flex;
  gap: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.foreground.info};
  border-radius: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  padding: 2rem;
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
`

type GameRenderedProps = {
  ongoingGameId: string | undefined
}
export const RenderedGame: FC<GameRenderedProps> = ({ ongoingGameId }) => {
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
    if (!ongoingGameId) return
    playMove({ variables: { ongoingGameId, move } })
  }

  if (ongoingGameLoading) return <P.DefaultText>loading ...</P.DefaultText>

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
