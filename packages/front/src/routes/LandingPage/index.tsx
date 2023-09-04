import styled from 'styled-components'

import { Hero } from './components/Hero'
import { Heading } from '../../components/Heading'
import { Games } from '../GamesPage/components/Games'

const StyledLandingPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8vw;
`

const StyledGamesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const LandingPage = () => {
  return (
    <StyledLandingPage>
      <Hero />
      <StyledGamesWrapper>
        <Heading.H2>Games</Heading.H2>
        <Games />
      </StyledGamesWrapper>
    </StyledLandingPage>
  )
}
