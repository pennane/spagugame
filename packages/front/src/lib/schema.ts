import { GameType } from '../types'

export const isGameType = (gameType?: string): gameType is GameType =>
  Object.values(GameType).includes(gameType as GameType)
