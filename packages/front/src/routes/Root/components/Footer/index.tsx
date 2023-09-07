import { FC } from 'react'
import styled from 'styled-components'
import { CustomLink } from '../../../../components/CustomLink'

const StyledFooter = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 4rem;
`

export const Footer: FC = () => {
  return (
    <StyledFooter>
      <CustomLink to="https://github.com/pennane/spagugame" target="_blank">
        Github
      </CustomLink>
    </StyledFooter>
  )
}
