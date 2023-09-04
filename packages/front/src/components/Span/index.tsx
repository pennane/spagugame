import styled from 'styled-components'
import { theme } from '../../theme'

const Default = styled.span<{ color?: keyof typeof theme.colors.foreground }>`
  font-size: 1rem;
  color: ${({ theme, color }) => theme.colors.foreground[color || 'primary']};
`

const Small = styled(Default)`
  font-size: 0.875rem;
`

export const Span = { DefaultText: Default, SmallText: Small }
