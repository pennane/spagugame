import { FC } from 'react'
import styled from 'styled-components'
import { CustomLink } from '../../../../../../components/CustomLink'
import { Heading } from '../../../../../../components/Heading'
import { Pill } from '../../../../../../components/Pill'
import { MOBILE_WIDTHS } from '../../../../../../hooks/useIsMobile'
import { LeaderboardPlayerFragment } from '../../../../graphql/Leaderboards.generated'
import { MiniProfileImage } from '../../../../../../games/components/Players'

const StyledGameLeaderboardPlayer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.foreground.success};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 2.5rem 3rem 3rem 1fr;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: ${MOBILE_WIDTHS.small}px) {
    display: flex;
    flex-wrap: wrap;
  }
`

type GameLeaderboardPlayerProps = {
  player: LeaderboardPlayerFragment
  rank: number
}

const StyledRank = styled.div`
  background: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 100%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.foreground.success};
`
type ShadowedPlayerWrapperProps = {
  children?: React.ReactNode
  to: string
}

const ShadowedPlayerWrapper: FC<ShadowedPlayerWrapperProps> = ({
  children,
  to,
  ...rest
}) => {
  return (
    <CustomLink boxShadow color="info" to={to} {...rest}>
      <StyledGameLeaderboardPlayer>{children}</StyledGameLeaderboardPlayer>
    </CustomLink>
  )
}

export const GameLeaderboardPlayer: FC<GameLeaderboardPlayerProps> = ({
  player,
  rank
}) => {
  return (
    <ShadowedPlayerWrapper to={`/profile/${player.userId}`}>
      <StyledRank>{rank}.</StyledRank>
      <Pill color="info">{player.elo}</Pill>
      <MiniProfileImage githubId={player.githubId || ''} />
      <Heading.H3>{player?.userName || player.userId}</Heading.H3>
    </ShadowedPlayerWrapper>
  )
}
