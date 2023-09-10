import { Link } from 'react-router-dom'

import styled, { css } from 'styled-components'
import { theme } from '../../theme'

const BoxShadowStyle = css`
  &:hover {
    text-decoration: none;
    box-shadow: inset 0px 0px 9px 0
      ${({ theme }) => theme.colors.foreground.primary};
  }
`

export const CustomLink = styled(Link)<{
  color?: keyof typeof theme.colors.foreground
  boxShadow?: boolean
}>`
  color: ${({ theme, color }) => theme.colors.foreground[color || 'info']};
  text-decoration: none;
  &:hover {
    color: ${({ theme, color }) => theme.colors.foreground[color || 'info']};
    text-decoration: underline;
    text-decoration-color: ${({ theme, color }) =>
      theme.colors.foreground[color || 'info']};
  }
  ${({ boxShadow }) => boxShadow && BoxShadowStyle}
`
