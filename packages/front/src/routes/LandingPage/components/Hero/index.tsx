import styled from 'styled-components'
import { Heading } from '../../../../components/Heading'
import { P } from '../../../../components/P'

const StyledHeroHeading = styled(Heading.H1)`
  font-size: 16vw;
  letter-spacing: -2.5vw;
  @media (min-width: 1000px) {
    font-size: 10.5rem;
    letter-spacing: -1.64rem;
  }
`

const StyledHeroSubHeading = styled(P.DefaultText)`
  font-size: 4vw;
  font-weight: 300;
  letter-spacing: -0.3vw;
  @media (min-width: 1000px) {
    font-size: 2.625rem;
    letter-spacing: -0.2rem;
  }
`

const StyledHero = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5vw;
  margin-top: 2.5vw;
  @media (min-width: 1000px) {
    gap: 3rem;
    margin-top: 1rem;
  }
`
export const Hero = () => {
  return (
    <StyledHero>
      <StyledHeroHeading>Spagugame</StyledHeroHeading>
      <StyledHeroSubHeading>da future of social gaming</StyledHeroSubHeading>
    </StyledHero>
  )
}
