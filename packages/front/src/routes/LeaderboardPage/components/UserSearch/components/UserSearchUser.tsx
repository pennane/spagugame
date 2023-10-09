import styled from 'styled-components'
import { MiniProfileImage } from '../../../../../games/components/Players'
import { FC } from 'react'
import { CustomLink } from '../../../../../components/CustomLink'
import { FindUsersUserFragment } from '../graphql/UserSearch.generated'
import { Span } from '../../../../../components/Span'

type UserSearchUser = {
  id: string
  eloBefore: number
  eloAfter: number
  score: number
}

const StyledUserSearchUser = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.foreground.danger};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;

  :last-child {
    margin-left: auto;
  }
`

type UserSearchUserProps = {
  user: FindUsersUserFragment
}

export const UserSearchUser: FC<UserSearchUserProps> = ({ user }) => {
  return (
    <StyledUserSearchUser>
      <MiniProfileImage
        githubId={user.githubId}
        profileImageSrc={user.profilePicture?.url}
      />
      <Span.DefaultText>{user.userName}</Span.DefaultText>
      <CustomLink color="info" to={`/profile/${user._id}`}>
        Profile
      </CustomLink>
    </StyledUserSearchUser>
  )
}
