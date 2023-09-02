import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { AuthenticationActions } from '../AuthenticationActions'
const StyledNavbar = styled.nav``

export const Navbar = () => {
  return (
    <StyledNavbar>
      <NavLink to="/">bro</NavLink>
      <AuthenticationActions />
    </StyledNavbar>
  )
}
