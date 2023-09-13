import { useCallback, useEffect, useRef } from 'react'

export const useCharacterSequence = (
  targetSequence: string[],
  callback: (sequence: string[]) => void
) => {
  const sequenceRef = useRef<string[]>([])

  const pushKey = useCallback(
    (key: string) => {
      sequenceRef.current.push(key)
      if (sequenceRef.current.length > targetSequence.length) {
        sequenceRef.current.shift()
      }
      if (
        sequenceRef.current.length === targetSequence.length &&
        sequenceRef.current.every((key, i) => key === targetSequence[i])
      ) {
        callback(targetSequence)
      }
    },
    [callback, targetSequence]
  )

  useEffect(() => {
    const keyDownHandler = ({ key }: KeyboardEvent) => pushKey(key)
    window.addEventListener('keydown', keyDownHandler)
    return () => {
      window.removeEventListener('keydown', keyDownHandler)
    }
  }, [pushKey])
}
