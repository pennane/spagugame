import { FC, useMemo } from 'react'

import { OngoingGame } from '../../../types'
import { GAME_TYPE_TO_SPECIFICATION } from '../../constants'

type GameRenderedProps = {
  game: OngoingGame
  playMove: (move: string) => void
}
export const State: FC<GameRenderedProps> = ({ game, playMove }) => {
  const gameType = game.gameType
  const jsonState = game.jsonState

  const specification = useMemo(
    () => GAME_TYPE_TO_SPECIFICATION[gameType],
    [gameType]
  )

  const deserializedState = useMemo(() => {
    return specification.parseState(jsonState)
  }, [specification, jsonState])

  if (!deserializedState) throw new Error('Failed to deserialize state')

  const State = useMemo(
    () => specification.renderState(deserializedState, playMove),
    [specification, deserializedState, playMove]
  )

  return State
}
