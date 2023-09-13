import { FC } from 'react'
import styled from 'styled-components'
import { CustomLink } from '../../../../components/CustomLink'

const StyledProfilePageNavBar = styled.div`
  display: flex;
  gap: 0.5rem;
`

const NavItem = styled(CustomLink)`
  color: #d6e8d3;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
`

export const ProfilePageNavBar: FC = () => {
  return (
    <StyledProfilePageNavBar>
      <NavItem to="stats">Stats</NavItem>
      <NavItem to="recent">Matches</NavItem>
      <NavItem to="achievements">Achievements</NavItem>
    </StyledProfilePageNavBar>
  )
}
