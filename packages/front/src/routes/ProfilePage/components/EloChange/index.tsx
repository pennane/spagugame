import { FC } from 'react'
import { Span } from '../../../../components/Span'
import { theme } from '../../../../theme'
import { Pill } from '../../../../components/Pill'

const getEloChangeColor = (eloChange: number) => {
  if (eloChange === 0) return 'info'
  if (eloChange > 0) return 'success'
  else return 'danger'
}

type EloChangeProps = {
  eloChange: number
}

export const EloChange: FC<EloChangeProps> = ({ eloChange }) => {
  const color = getEloChangeColor(eloChange)
  return (
    <Pill color={color} onlyBorder>
      <Span.SmallText
        style={{
          color: theme.colors.foreground[color]
        }}
      >
        {eloChange > 0 ? '+' : '-'}
        {Math.round(Math.abs(eloChange))}
      </Span.SmallText>
    </Pill>
  )
}
