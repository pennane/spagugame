import styled from 'styled-components'
import { theme } from '../../theme'

const Default = styled.p<{ color?: keyof typeof theme.colors.foreground }>`
  font-size: 1rem;
  color: ${({ theme, color }) => theme.colors.foreground[color || 'primary']};
  margin: 0;
`

const Small = styled(Default)`
  font-size: 0.875rem;
`

export const P = { DefaultText: Default, SmallText: Small }
