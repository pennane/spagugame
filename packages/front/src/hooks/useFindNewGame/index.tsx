import { useState } from 'react'
import { GameType, OngoingGameProcessState } from '../../types'
import {
  useGameQuery,
  useNewGameMutation
} from '../../routes/GamePage/graphql/Game.generated'
import { isEmpty } from 'ramda'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const useFindNewGame = (gameType: GameType) => {
  const [searching, setSearching] = useState(false)
  const [find, setFind] = useState(false)
  const navigate = useNavigate()

  const [createNewGame] = useNewGameMutation()

  const handleCreateNewGame = () => {
    setSearching(false)
    createNewGame({ variables: { gameType, private: false } })
      .then((res) => {
        res.data?.createOngoingGame._id &&
          navigate(`/game/${gameType}/${res.data.createOngoingGame._id}`)
      })
      .catch((e) => {
        if (
          typeof e.message === 'string' &&
          e.message.includes('Cannot join multiple games at the same time')
        ) {
          toast(
            'You are already in a game. You must leave the old game before joining  new.'
          )
        }
      })
  }

  useGameQuery({
    variables: { gameType },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const game = data.game
      const games = data.game?.ongoingGames || []

      if (!game || isEmpty(games)) {
        return handleCreateNewGame()
      }
      const joinableGame = games.filter(
        (g) =>
          !g.isPrivate &&
          g.processState === OngoingGameProcessState.NotStarted &&
          g.players.length < game.maxPlayers
      )[0]

      if (!joinableGame) {
        return handleCreateNewGame()
      }

      navigate(`/game/${gameType}/${joinableGame._id}`)
    },
    onError: () => {
      handleCreateNewGame()
    },
    skip: !find
  })

  return [
    () => {
      setFind(true)
      setSearching(true)
    },
    searching
  ] as const
}
