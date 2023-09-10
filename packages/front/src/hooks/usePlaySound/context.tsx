import { FC, ReactNode, createContext, useState } from 'react'
import { getFromStorage, setToStorage } from '../../lib/localstorage'

const WANT_SOUND_KEY = `want-sound`

export const SoundContext = createContext<[boolean, (value: boolean) => void]>([
  false,
  () => {}
])

type SoundContextProviderProps = { children?: ReactNode }

export const SoundContextProvider: FC<SoundContextProviderProps> = ({
  children
}) => {
  const [wantSound, setWantSound] = useState(
    getFromStorage(WANT_SOUND_KEY, true)
  )

  const handleSetWantSound = (value: boolean) => {
    setToStorage(WANT_SOUND_KEY, value)
    setWantSound(value)
  }

  return (
    <SoundContext.Provider value={[wantSound, handleSetWantSound]}>
      {children}
    </SoundContext.Provider>
  )
}
