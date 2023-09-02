import { FC } from 'react'
import styled from 'styled-components'
import { useCurrentUser } from '../../../../hooks/useCurrentUser'
import { Button } from '../../../../components/Button'

const StyledAuthenticationActions = styled.div``

export const AuthenticationActions: FC = () => {
  const user = useCurrentUser()

  const handleLogin = () => {
    window.open('http://localhost:3000/auth/github', '_self')
  }

  const handleLogout = () => {
    window.open('http://localhost:3000/auth/logout', '_self')
  }

  return (
    <StyledAuthenticationActions>
      {!user && <Button onClick={handleLogin}>Login with Github</Button>}
      {user && (
        <>
          Logged in as {user.userName}{' '}
          <Button onClick={handleLogout}>Logout</Button>
        </>
      )}
    </StyledAuthenticationActions>
  )
}
