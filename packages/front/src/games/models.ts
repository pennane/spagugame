import { ReactNode } from 'react'

export type GameSpecification<T> = {
  validateState: (v: unknown) => v is T
  parseState: (v: string) => T | null
  renderState: (state: T, playMove: (move: string) => void) => JSX.Element
  getPlayerIdentifier: (playerIndex: number) => ReactNode
}
