import { FC } from 'react'
import styled from 'styled-components'
import { useCurrentUser } from '../../../../hooks/useCurrentUser'
import { Button } from '../../../../components/Button'
import { Span } from '../../../../components/Span'
import { ProfileImage } from '../../../ProfilePage'
import { useIsMobile } from '../../../../hooks/useIsMobile'

const StyledAuthenticationActions = styled.div`
  color: ${({ theme }) => theme.colors.foreground.success};
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`

const MiniProfileImage = styled(ProfileImage)`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 100%;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.background.secondary};
`

export const AuthenticationActions: FC = () => {
  const user = useCurrentUser()
  const isMobile = useIsMobile()

  const handleLogin = () => {
    window.open(`${import.meta.env.VITE_SERVER_BASE_URL}/auth/github`, '_self')
  }

  const handleLogout = () => {
    window.open(`${import.meta.env.VITE_SERVER_BASE_URL}/auth/logout`, '_self')
  }

  return (
    <StyledAuthenticationActions>
      {!user && <Button onClick={handleLogin}>Login with Github</Button>}
      {user && (
        <>
          {!isMobile && (
            <Span.SmallText>Logged in as {user.userName}</Span.SmallText>
          )}
          {isMobile && <MiniProfileImage githubId={user.githubId} />}

          <Button onClick={handleLogout}>Logout</Button>
        </>
      )}
    </StyledAuthenticationActions>
  )
}
