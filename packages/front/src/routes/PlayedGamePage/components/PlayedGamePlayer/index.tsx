import { FC } from 'react'
import { usePlayedGamePlayerQuery } from './graphql/PlayedGamePlayer.generated'
import styled from 'styled-components'
import { Heading } from '../../../../components/Heading'
import { P } from '../../../../components/P'
import { EloChange } from '../../../ProfilePage/components/EloChange'
import { Pill } from '../../../../components/Pill'
import { CustomLink } from '../../../../components/CustomLink'
import { MOBILE_WIDTHS } from '../../../../hooks/useIsMobile'

type PlayedGamePlayer = {
  id: string
  eloBefore: number
  eloAfter: number
  score: number
}

const StyledPlayedGamePlayer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.foreground.danger};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 1rem;
  border-radius: 0.5rem;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: ${MOBILE_WIDTHS.small}px) {
    display: flex;
    flex-wrap: wrap;
  }
`

type PlayedGamePlayerProps = {
  player: PlayedGamePlayer
}

export const PlayedGamePlayer: FC<PlayedGamePlayerProps> = ({ player }) => {
  const { data } = usePlayedGamePlayerQuery({
    variables: { userId: player.id! },
    skip: !player.id
  })
  const user = data?.user

  return (
    <StyledPlayedGamePlayer>
      <Heading.H3>{user?.userName || player.id}</Heading.H3>
      <Pill color="info">{player.eloBefore}</Pill>

      <EloChange eloChange={player.eloAfter - player.eloBefore} />

      <Pill color="invertedSecondary">
        <P.SmallText>Final score: {player.score}</P.SmallText>
      </Pill>

      <CustomLink color="info" to={`/profile/${player.id}`}>
        Profile
      </CustomLink>
    </StyledPlayedGamePlayer>
  )
}
