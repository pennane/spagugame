import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { AuthenticationActions } from '../AuthenticationActions'
import { useCurrentUser } from '../../../../hooks/useCurrentUser'
import { MOBILE_WIDTHS } from '../../../../hooks/useIsMobile'

const StyledNavbarContainer = styled.div``

const StyledNavbarUnderline = styled.div`
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.foreground.primary},
    ${({ theme }) => theme.colors.foreground.success}
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  height: 0.1rem;
`

const StyledNavbar = styled.nav`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;

  padding: 1rem 2rem;

  @media (max-width: ${MOBILE_WIDTHS.default}px) {
    padding: 1rem 1rem;
  }
`

const StyledNavLinks = styled.div`
  display: flex;
  gap: 1.25rem;
  justify-content: space-between;
  align-items: center;
`

const StyledNavLink = styled(NavLink)`
  color: ${({ theme }) => theme.colors.foreground.primary};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;

  &:hover {
    font-weight: 300;
    letter-spacing: 0.018rem;
  }
`

export const Navbar = () => {
  const currentUser = useCurrentUser()

  return (
    <StyledNavbarContainer>
      <StyledNavbar>
        <StyledNavLinks>
          <StyledNavLink to="/">Home</StyledNavLink>
          <StyledNavLink to="/game">Games</StyledNavLink>
          <StyledNavLink to="/played">Matches</StyledNavLink>
          {currentUser && <StyledNavLink to="/profile">Profile</StyledNavLink>}
        </StyledNavLinks>

        <AuthenticationActions />
      </StyledNavbar>
      <StyledNavbarUnderline />
    </StyledNavbarContainer>
  )
}
