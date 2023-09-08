import { GameDocument } from '../../routes/GamePage/graphql/Game.generated'
import { GameType } from '../../types'
import { useNewOngoingGamesSubscription } from './graphql/NewOngoingGames.generated'
import { isGameType } from '../../lib/schema'

export const useSubscribeGameTypeOngoingGames = ({
  gameType,
  skip
}: {
  gameType: GameType
  skip: boolean
}) => {
  useNewOngoingGamesSubscription({
    skip,
    variables: { gameType },
    onData: ({ client, data }) => {
      console.log('NEW GAME!!!')

      const game = data.data?.newOngoingGame
      if (!game || !isGameType(gameType)) return

      client.cache.updateQuery(
        {
          query: GameDocument,
          variables: { gameType }
        },
        (data) => {
          console.log(data)

          return {
            game: {
              ...data.game,
              ongoingGames: [...data.game.ongoingGames, game]
            }
          }
        }
      )
    }
  })
}
