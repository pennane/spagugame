import { FC } from 'react'
import styled from 'styled-components'

const StyledProfileImageContainer = styled.div`
  width: 10rem;
  height: 10rem;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`
const StyledProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

type ProfileImageProps = {
  githubId?: string
} & React.HTMLAttributes<HTMLDivElement>

export const ProfileImage: FC<ProfileImageProps> = ({ githubId, ...rest }) => {
  return (
    <StyledProfileImageContainer {...rest}>
      <StyledProfileImage
        src={`https://avatars.githubusercontent.com/u/${githubId}?v=4`}
      />
    </StyledProfileImageContainer>
  )
}
