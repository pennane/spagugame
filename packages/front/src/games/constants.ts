import { GameType } from '../types'
import { TickTackToe } from './TickTackToe'

export const GAME_TYPE_TO_SPECIFICATION = {
  [GameType.TickTackToe]: TickTackToe
} satisfies Record<GameType, any>
