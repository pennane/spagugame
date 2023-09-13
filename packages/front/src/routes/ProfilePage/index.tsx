import { FC } from 'react'
import { Outlet, useOutletContext, useParams } from 'react-router-dom'
import { Heading } from '../../components/Heading'

import styled from 'styled-components'
import {
  ProfilePageUserQuery,
  useFollowUserMutation,
  useProfilePageUserQuery
} from './graphql/ProfilePage.generated'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { P } from '../../components/P'
import { Button } from '../../components/Button'
import { ProfileImage } from './components/ProfileImage'
import { ProfilePageNavBar } from './components/ProfilePageNavBar'
import { CustomLink } from '../../components/CustomLink'

const StyledProfilePage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`
const StyledProfileHeader = styled.div``

const FollowingLinks = styled.div`
  display: flex;
  gap: 0.5rem;
`

const FollowingLink = styled(CustomLink)`
  font-weight: 300;
  font-size: 0.9rem;
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

type ContextType = { user: ProfilePageUserQuery['user'] | null }

export function useProfileUser() {
  return useOutletContext<ContextType>()
}

export const ProfilePage: FC = () => {
  const currentUser = useCurrentUser()
  const { userId } = useParams()
  const profileUserId = userId || currentUser?._id

  const [followMutation] = useFollowUserMutation()

  const { data: profileUserData, loading: profileUserLoading } =
    useProfilePageUserQuery({
      variables: { userId: profileUserId! },
      skip: !profileUserId
    })

  const profileUser = profileUserData?.user

  if (profileUserLoading) return <P.DefaultText>Loading...</P.DefaultText>
  if (!profileUser) return <P.DefaultText>Profile not found</P.DefaultText>

  const alreadyFollowing = currentUser?.following?.some((u) => u._id === userId)

  return (
    <StyledProfilePage>
      <ProfilePageNavBar />
      <Section>
        <Section>
          <StyledProfileHeader>
            <Heading.H1>{profileUser.userName}</Heading.H1>
          </StyledProfileHeader>
        </Section>

        <ProfileImage githubId={profileUser.githubId} />
        <FollowingLinks>
          <FollowingLink to="followers" color="primary">
            <b>{profileUser.followers.length} </b>followers
          </FollowingLink>
          <FollowingLink to="following" color="primary">
            <b>{profileUser.following.length}</b> following
          </FollowingLink>
        </FollowingLinks>

        {currentUser?._id !== profileUser._id && (
          <Button
            style={{ width: '10rem' }}
            onClick={() =>
              userId &&
              followMutation({
                variables: { userId: userId, toggle: !alreadyFollowing }
              })
            }
          >
            {alreadyFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        )}
      </Section>

      <Outlet context={{ user: profileUserData.user }} />
    </StyledProfilePage>
  )
}
