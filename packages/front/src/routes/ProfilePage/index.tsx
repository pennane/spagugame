import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Heading } from '../../components/Heading'

import styled from 'styled-components'
import { useProfilePageUserQuery } from './graphql/ProfilePage.generated'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { P } from '../../components/P'
import { EloChange } from './components/EloChange'
import { CustomLink } from '../../components/CustomLink'

const StyledProfilePage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const StyledProfileHeader = styled.div``

const StyledGame = styled.div`
  border: 1px solid #ff5666;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StyledRecentMatches = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StyledRecentMatch = styled.div`
  border-bottom: 1px solid #ff5666;
  padding: 0.75rem 1rem;

  display: flex;
  gap: 0.5rem;
  justify-content: flex-start;
  align-items: center;
`

type ProfileImageProps = {
  githubId: string
} & React.HTMLAttributes<HTMLDivElement>

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

export const ProfileImage: FC<ProfileImageProps> = ({ githubId, ...rest }) => {
  return (
    <StyledProfileImageContainer {...rest}>
      <StyledProfileImage
        src={`https://avatars.githubusercontent.com/u/${githubId}?v=4`}
      />
    </StyledProfileImageContainer>
  )
}

export const ProfilePage: FC = () => {
  const currentUser = useCurrentUser()
  const { userId } = useParams()
  const profileUserId = userId || currentUser?._id

  const { data: profileUserData, loading: profileUserLoading } =
    useProfilePageUserQuery({
      variables: { userId: profileUserId! },
      skip: !profileUserId
    })

  const profileUser = profileUserData?.user
  if (profileUserLoading) return <div>Loading...</div>
  if (!profileUser) return <div>Profile not found</div>

  return (
    <StyledProfilePage>
      <StyledProfileHeader>
        <Heading.H1>{profileUser.userName}</Heading.H1>
      </StyledProfileHeader>
      <ProfileImage githubId={profileUser.githubId} />
      <Heading.H2>Stats:</Heading.H2>
      {profileUser.stats.map((stat) => (
        <StyledGame key={stat._id}>
          <Heading.H3>{stat.gameType}</Heading.H3>
          <P.DefaultText>{Math.floor(stat.elo)} elo</P.DefaultText>
          <P.DefaultText>{stat.totalWins} wins</P.DefaultText>
        </StyledGame>
      ))}
      <Heading.H2>Recent matches:</Heading.H2>
      <StyledRecentMatches>
        {profileUser.playedGames.map((game) => {
          const playerIndex = game.playerIds.findIndex(
            (p) => p === profileUser._id
          )
          const eloChange =
            playerIndex !== -1 &&
            Math.floor(
              game.playerElosAfter[playerIndex] -
                game.playerElosBefore[playerIndex]
            )

          return (
            <StyledRecentMatch key={game._id}>
              <P.DefaultText>{game.gameType}</P.DefaultText>
              <P.SmallText>({game._id})</P.SmallText>
              <P.DefaultText>
                {eloChange !== false && <EloChange eloChange={eloChange} />}
              </P.DefaultText>
              <CustomLink to={`/played/${game.gameType}/${game._id}`}>
                View game
              </CustomLink>
            </StyledRecentMatch>
          )
        })}
      </StyledRecentMatches>
    </StyledProfilePage>
  )
}
