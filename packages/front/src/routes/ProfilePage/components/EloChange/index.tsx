import { FC } from 'react'

import { theme } from '../../../../theme'
import { Pill } from '../../../../components/Pill'
import { isNil } from 'ramda'

const getEloChangeColor = (eloChange?: number) => {
  if (isNil(eloChange)) return 'info'
  else if (eloChange === 0) return 'info'
  else if (eloChange > 0) return 'success'
  else return 'danger'
}

const getEloChangeIcon = (eloChange?: number) => {
  if (!eloChange) return '-'
  if (eloChange > 0) return '+'
  if (eloChange < 0) return '-'
}

type EloChangeProps = {
  eloChange: number | undefined
} & React.HTMLAttributes<HTMLDivElement>

export const EloChange: FC<EloChangeProps> = ({ eloChange, ...rest }) => {
  const color = getEloChangeColor(eloChange)
  const changeIcon = getEloChangeIcon(eloChange)
  const eloChangeNumber = isNil(eloChange)
    ? ''
    : Math.round(Math.abs(eloChange))
  return (
    <Pill {...rest} color={color} onlyBorder>
      <span
        style={{
          color: theme.colors.foreground[color]
        }}
      >
        {changeIcon}
        {eloChangeNumber}
      </span>
    </Pill>
  )
}
