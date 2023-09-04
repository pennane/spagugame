import { FC } from 'react'
import styled from 'styled-components'
import { useCurrentUser } from '../../../../hooks/useCurrentUser'
import { Button } from '../../../../components/Button'
import { Span } from '../../../../components/Span'

const StyledAuthenticationActions = styled.div`
  color: ${({ theme }) => theme.colors.foreground.success};
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`
const StyledButton = styled(Button)``

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
      {!user && (
        <StyledButton onClick={handleLogin}>Login with Github</StyledButton>
      )}
      {user && (
        <>
          <Span.SmallText>Logged in as {user.userName}</Span.SmallText>
          <StyledButton onClick={handleLogout}>Logout</StyledButton>
        </>
      )}
    </StyledAuthenticationActions>
  )
}
