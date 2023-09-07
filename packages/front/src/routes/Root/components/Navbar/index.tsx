import { NavLink, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { AuthenticationActions } from '../AuthenticationActions'
import { useCurrentUser } from '../../../../hooks/useCurrentUser'
import { MOBILE_WIDTHS, useIsMobile } from '../../../../hooks/useIsMobile'
import { useEffect, useState } from 'react'
import { isNotNil } from 'ramda'
import { Button } from '../../../../components/Button'
import { theme } from '../../../../theme'

const BurgirLine = styled.div`
  height: 2px;
  background: #79b473;
  background-color: ${theme.colors.foreground.primary};
  border-radius: 0.5rem;
  opacity: 0.9;
`
const StyledBurgir = styled.div`
  opacity: 0.9;
  display: flex;
  height: 100%;
  width: 100%;
  padding: 0.2rem;
  flex-direction: column;
  justify-content: center;
  gap: 0.15rem;
  &:hover {
    opacity: 1;
  }
`

const Burgir = () => {
  return (
    <StyledBurgir>
      <BurgirLine />
      <BurgirLine />
      <BurgirLine />
    </StyledBurgir>
  )
}

const StyledMobileNavbarContainer = styled.div`
  position: relative;
`

const StyledThingEiJaksa = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  padding: 1rem 1rem;
`

const StyledNavbarContainer = styled.div``

const StyledNavbarUnderline = styled.div`
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.foreground.primary},
    ${({ theme }) => theme.colors.foreground.success}
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  height: 0.05rem;

  @keyframes LineAnimation {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: -33% 50%;
    } /* instead of 0% 50% */
  }
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

const useNavLinks = () => {
  const currentUser = useCurrentUser()
  return [
    ['Home', '/'],
    ['Games', '/game'],
    ['Matches', '/played'],
    currentUser ? ['Profile', '/profile'] : null
  ].filter(isNotNil) as [name: string, path: string][]
}

const openStyles = css`
  background-color: ${theme.colors.background.tertiary};
  box-shadow: inset 0 2px 5px 0 rgb(121 180 115 / 20%);
  position: absolute;
  left: 0;
`

const closedStyles = css`
  position: absolute;
  left: -100%;
  pointer-events: none;
`

const MobileNavbar = {
  Wrapper: styled.nav<{ $open: boolean }>`
    flex: 1;
    z-index: 2;
    top: 100%;

    align-self: flex-start;

    padding: 1rem 3rem;

    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.25s ease;
    width: 100%;

    background-color: transparent;
    ${({ $open }) => ($open ? openStyles : closedStyles)}
  `,
  Logo: styled.h1`
    border: 1px solid gray;
    padding: 0.5rem 1rem;
  `,
  Items: styled.ul`
    display: flex;
    list-style: none;
    flex-direction: column;
    gap: 1rem;
  `,
  Item: styled.li`
    padding: 0;
    cursor: pointer;
  `
}

export const Navbar = () => {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()
  const navLinks = useNavLinks()
  const location = useLocation()
  useEffect(() => {
    setOpen(false)
  }, [location, setOpen])

  if (isMobile)
    return (
      <StyledMobileNavbarContainer>
        <StyledThingEiJaksa>
          <Button
            color="primary"
            style={{
              height: '1.5rem',
              width: '1.5rem',
              padding: 0,
              borderRadius: '0.3rem'
            }}
            onClick={() => setOpen((v) => !v)}
          >
            <Burgir />
          </Button>
          <StyledNavLink to={navLinks[0][1]}>{navLinks[0][0]}</StyledNavLink>
        </StyledThingEiJaksa>
        <MobileNavbar.Wrapper $open={open}>
          <MobileNavbar.Items>
            {navLinks.map(([name, path], i) => (
              <MobileNavbar.Item key={i}>
                <StyledNavLink to={path}>{name}</StyledNavLink>
              </MobileNavbar.Item>
            ))}
            <AuthenticationActions />
          </MobileNavbar.Items>
        </MobileNavbar.Wrapper>
      </StyledMobileNavbarContainer>
    )

  return (
    <StyledNavbarContainer>
      <StyledNavbar>
        <StyledNavLinks>
          {navLinks.map(([name, path], i) => (
            <StyledNavLink key={i} to={path}>
              {name}
            </StyledNavLink>
          ))}
        </StyledNavLinks>

        <AuthenticationActions />
      </StyledNavbar>
      <StyledNavbarUnderline />
    </StyledNavbarContainer>
  )
}
