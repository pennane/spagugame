import { FC } from 'react'
import { Outlet, useOutletContext, useParams } from 'react-router-dom'
import { Heading } from '../../components/Heading'

import styled from 'styled-components'
import {
  ProfilePageUserQuery,
  useFollowUserMutation,
  useProfilePageUserQuery,
  useUploadProfileImageMutation
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

const StyledFileInput = styled.input`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  font-size: 0;
  &::file-selector-button {
    border-radius: 0.5rem;
    color: ${({ theme }) => theme.colors.foreground.success};
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors.foreground.success};
    padding: 0.25rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: border-color 0.1s;
  }

  &::file-selector-button:hover {
    box-shadow: inset 0 0px 3px 0
      ${({ theme }) => theme.colors.foreground.primary};
  }
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
  const [uploadProfileImageMutation] = useUploadProfileImageMutation()

  const { data: profileUserData, loading: profileUserLoading } =
    useProfilePageUserQuery({
      variables: { userId: profileUserId! },
      skip: !profileUserId
    })

  const profileUser = profileUserData?.user

  if (profileUserLoading) return <P.DefaultText>Loading...</P.DefaultText>
  if (!profileUser) return <P.DefaultText>Profile not found</P.DefaultText>

  const alreadyFollowing = currentUser?.following?.some((u) => u._id === userId)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploadProfileImageMutation({ variables: { file } })
  }

  return (
    <StyledProfilePage>
      <ProfilePageNavBar />
      <Section>
        <Section>
          <StyledProfileHeader>
            <Heading.H1>{profileUser.userName}</Heading.H1>
          </StyledProfileHeader>
        </Section>

        <ProfileImage
          githubId={profileUser.githubId}
          profileImageSrc={profileUser.profilePictureUrl}
        />
        {currentUser?._id === profileUser._id && (
          <div>
            <StyledFileInput
              accept="image/png, image/jpeg"
              type="file"
              onChange={handleFileChange}
            />
          </div>
        )}
        <FollowingLinks>
          <FollowingLink to="followers" color="primary">
            <b>{profileUser.followers.length} </b>followers
          </FollowingLink>
          <FollowingLink to="following" color="primary">
            <b>{profileUser.following.length}</b> following
          </FollowingLink>
        </FollowingLinks>

        {currentUser && currentUser?._id !== profileUser._id && (
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
