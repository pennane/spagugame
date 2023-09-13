import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Heading } from '../../components/Heading'

import styled from 'styled-components'
import { useProfilePageUserQuery } from './graphql/ProfilePage.generated'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { P } from '../../components/P'
import { PlayedGame } from '../PlayedGamesPage'
import { Achievements } from './components/Achievements'
import { MOBILE_WIDTHS } from '../../hooks/useIsMobile'

const StyledProfilePage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`
const StyledProfileHeader = styled.div``

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const StyledGamesWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: flex-start;
  @media (max-width: ${MOBILE_WIDTHS.default}px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`

const StyledGameStats = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: ${MOBILE_WIDTHS.default}px) {
    flex-direction: row;
    gap: 0.5rem;
  }
`

const StyledGame = styled.div`
  width: 14rem;
  border: 1px solid #ff5666;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  @media (max-width: ${MOBILE_WIDTHS.default}px) {
    width: 100%;
  }
`

const StyledRecentMatches = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

type ProfileImageProps = {
  githubId?: string
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
  if (profileUserLoading) return <P.DefaultText>Loading...</P.DefaultText>
  if (!profileUser) return <P.DefaultText>Profile not found</P.DefaultText>

  return (
    <StyledProfilePage>
      <Section>
        <StyledProfileHeader>
          <Heading.H1>{profileUser.userName}</Heading.H1>
        </StyledProfileHeader>
        <ProfileImage githubId={profileUser.githubId} />
      </Section>
      <Section>
        <Heading.H2>Stats:</Heading.H2>
        <StyledGamesWrapper>
          {profileUser.stats.map((stat) => (
            <StyledGame key={stat._id}>
              <Heading.H3>{stat.gameType}</Heading.H3>
              <StyledGameStats>
                <P.DefaultText>{Math.floor(stat.elo)} elo</P.DefaultText>
                <P.DefaultText>{stat.totalWins} wins</P.DefaultText>
                <P.DefaultText>{stat.totalPlayed} played</P.DefaultText>
              </StyledGameStats>
            </StyledGame>
          ))}
        </StyledGamesWrapper>
      </Section>
      <Section>
        <Heading.H2>Recent matches:</Heading.H2>
        <StyledRecentMatches>
          {profileUser.playedGames.map((game) => {
            const playerIndex = game.playerIds.findIndex(
              (p) => p === profileUser._id
            )
            const eloChange =
              playerIndex !== -1
                ? Math.floor(
                    game.playerElosAfter[playerIndex] -
                      game.playerElosBefore[playerIndex]
                  )
                : undefined

            return (
              <PlayedGame
                key={game._id}
                game={game}
                profilePage
                eloChange={eloChange}
              />
            )
          })}
        </StyledRecentMatches>
      </Section>
      <Section>
        <Heading.H2>Achievements:</Heading.H2>
        <Achievements achievements={profileUser.achievements || []} />
      </Section>
    </StyledProfilePage>
  )
}
