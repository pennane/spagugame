import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { AuthenticationActions } from '../AuthenticationActions'
const StyledNavbar = styled.nav`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
`

export const Navbar = () => {
  return (
    <StyledNavbar>
      <NavLink to="/">Home</NavLink>
      <AuthenticationActions />
    </StyledNavbar>
  )
}
