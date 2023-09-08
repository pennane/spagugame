import { GameType } from '../types'
import { FindFour } from './specifications/FindFour'
import { TickTackToe } from './specifications/TickTackToe'

export const GAME_TYPE_TO_SPECIFICATION = {
  [GameType.TickTackToe]: TickTackToe,
  [GameType.FindFour]: FindFour
} satisfies Record<GameType, any>
