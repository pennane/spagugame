import { Link } from 'react-router-dom'

import styled from 'styled-components'
import { theme } from '../../theme'

export const CustomLink = styled(Link)<{
  color?: keyof typeof theme.colors.foreground
}>`
  color: ${({ theme, color }) => theme.colors.foreground[color || 'info']};
  text-decoration: none;
  &:hover {
    color: ${({ theme, color }) => theme.colors.foreground[color || 'info']};
    text-decoration: underline;
    text-decoration-color: ${({ theme, color }) =>
      theme.colors.foreground[color || 'info']};
  }
`
