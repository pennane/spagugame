import { FC } from 'react'
import { useCurrentUser } from '../../../../hooks/useCurrentUser'
import { useFollowUserMutation } from '../../graphql/ProfilePage.generated'
import { useLocation } from 'react-router-dom'

import { useFollowingListUserQuery } from './graphql/FollowingList.generated'
import { MiniProfileImage } from '../../../../games/components/Players'
import { P } from '../../../../components/P'
import { Button } from '../../../../components/Button'
import { Heading } from '../../../../components/Heading'
import { Section, useProfileUser } from '../..'
import styled from 'styled-components'
import { CustomLink } from '../../../../components/CustomLink'

const Kasdf = styled.div`
  display: flex;
  width: 100%;
  gap: 0.25rem;
  padding: 0.5rem 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.background.tertiary};
  justify-content: space-between;
  max-width: 600px;
`

const User = styled.div`
  flex-basis: 100%;
  display: flex;
  gap: 0.25rem;
`

export const FollowingList: FC = () => {
  const currentUser = useCurrentUser()
  const { user: profileUser } = useProfileUser()

  const type = useLocation().pathname.includes('following')
    ? 'following'
    : 'followers'

  const profileUserId = profileUser?._id

  const [followMutation] = useFollowUserMutation()
  const { data, loading } = useFollowingListUserQuery({
    variables: { userId: profileUserId! },
    skip: !profileUserId
  })

  return (
    <Section>
      <Heading.H2>{type}</Heading.H2>
      {loading && <P.DefaultText>Loading ...</P.DefaultText>}
      {!loading &&
        data?.user?.[type].map((user) => {
          const alreadyFollowing = currentUser?.following?.some(
            (u) => u._id === user._id
          )

          return (
            <Kasdf>
              <CustomLink to={`/profile/${user._id}`}>
                <User>
                  <MiniProfileImage
                    githubId={user.githubId}
                    profileImageSrc={user.profilePicture?.url}
                  />
                  <P.DefaultText>{user.userName}</P.DefaultText>
                </User>
              </CustomLink>

              {currentUser && user._id !== currentUser?._id && (
                <Button
                  onClick={() =>
                    followMutation({
                      variables: { userId: user._id, toggle: !alreadyFollowing }
                    })
                  }
                >
                  {alreadyFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </Kasdf>
          )
        })}
    </Section>
  )
}
