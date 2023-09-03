import { FC, useMemo } from 'react'

import { OngoingGame } from '../../../types'
import { GAME_TYPE_TO_SPECIFICATION } from '../../constants'

type GameRenderedProps = {
  game: OngoingGame
  playMove: (move: string) => void
}
export const State: FC<GameRenderedProps> = ({ game, playMove }) => {
  const specification = useMemo(
    () => GAME_TYPE_TO_SPECIFICATION[game.gameType],
    [game.gameType]
  )

  const deserializedState = useMemo(
    () => specification.parseState(game.jsonState),
    [specification, game.jsonState]
  )

  if (!deserializedState) throw new Error('Failed to deserialize state')

  const State = useMemo(
    () => specification.renderState(deserializedState, playMove),
    [specification, deserializedState, playMove]
  )

  return State
}
