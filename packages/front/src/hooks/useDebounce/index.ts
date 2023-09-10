import { useEffect, useState } from 'react'

export const useDebounce = <T>(value: T, timeout: number = 500): T => {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value)
    }, timeout)
    return () => {
      clearTimeout(handler)
    }
  }, [value, timeout])
  return debounced
}
