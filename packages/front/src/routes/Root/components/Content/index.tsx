import { FC } from 'react'
import styled from 'styled-components'
const StyledContent = styled.main``

type ContentProps = {
  children?: React.ReactNode
}
export const Content: FC<ContentProps> = ({ children }) => {
  return <StyledContent>{children}</StyledContent>
}
