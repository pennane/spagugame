import { FC } from 'react'
import { theme } from '../../theme'
import styled from 'styled-components'

type PillProps = {
  color: keyof typeof theme.colors.foreground
  onlyBorder?: boolean
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

const StyledPill = styled.div<{
  $color: keyof typeof theme.colors.foreground
  $onlyBorder?: boolean
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ $color, theme, $onlyBorder }) =>
    $onlyBorder ? 'transparent' : theme.colors.foreground[$color]};
  border: 1px solid ${({ $color, theme }) => theme.colors.foreground[$color]};
  color: white;
  width: fit-content;
  padding: 0.1rem 0.25rem;
  font-size: 0.75rem;
  border-radius: 0.5rem;
`

export const Pill: FC<PillProps> = ({
  color,
  children,
  onlyBorder,
  ...rest
}) => {
  return (
    <StyledPill $color={color} $onlyBorder={onlyBorder} {...rest}>
      {children}
    </StyledPill>
  )
}
