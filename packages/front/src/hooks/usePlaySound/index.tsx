import { useCallback, useContext } from 'react'
import { SoundContext } from './context'

const soundNames = [
  'countdown',
  'finished',
  'join',
  'left',
  'start',
  'playerPlay',
  'opponentPlay'
] as const
const sounds = soundNames.reduce((acc, name) => {
  const audio = new Audio(`/sound/${name}.wav`)
  audio.volume = 0.5
  acc[name] = audio

  return acc
}, {} as Record<(typeof soundNames)[number], HTMLAudioElement>)

export const usePlaySound = () => {
  const [wantSound] = useContext(SoundContext)
  const playSound = useCallback(
    (name: keyof typeof sounds) => {
      wantSound && sounds[name].play()
    },
    [wantSound]
  )

  return playSound
}
