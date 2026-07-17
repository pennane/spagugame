import { GameType } from '../types'
import { Chess } from './specifications/Chess'
import { ColorFlood } from './specifications/ColorFlood'
import { FindFour } from './specifications/FindFour'
import { TickTackToe } from './specifications/TickTackToe'

export const GAME_TYPE_TO_SPECIFICATION = {
  [GameType.TickTackToe]: TickTackToe,
  [GameType.FindFour]: FindFour,
  [GameType.ColorFlood]: ColorFlood,
  [GameType.Chess]: Chess,
} satisfies Record<GameType, any>
