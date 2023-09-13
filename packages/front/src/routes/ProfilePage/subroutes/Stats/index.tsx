import { FC } from 'react'
import styled from 'styled-components'
import { Section, useProfileUser } from '../..'
import { Heading } from '../../../../components/Heading'
import { P } from '../../../../components/P'
import { MOBILE_WIDTHS } from '../../../../hooks/useIsMobile'

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

export const Stats: FC = () => {
  const { user: profileUser } = useProfileUser()

  return (
    <Section>
      <Heading.H2>Stats:</Heading.H2>
      <StyledGamesWrapper>
        {profileUser?.stats.map((stat) => (
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
  )
}
