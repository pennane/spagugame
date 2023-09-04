import { FC } from 'react'
import { theme } from '../../theme'
import styled from 'styled-components'

type PillProps = {
  color: keyof typeof theme.colors.foreground
  children: React.ReactNode
}

const StyledPill = styled.div<{
  $color: keyof typeof theme.colors.foreground
}>`
  background-color: ${({ $color, theme }) => theme.colors.foreground[$color]};
  color: white;
  width: fit-content;
  padding: 0.1rem 0.25rem;
  font-size: 0.75rem;
  border-radius: 0.5rem;
`

export const Pill: FC<PillProps> = ({ color, children }) => {
  return <StyledPill $color={color}>{children}</StyledPill>
}
