import styled from 'styled-components'
import { Heading } from '../../../../components/Heading'
import { P } from '../../../../components/P'

const StyledHeroHeading = styled(Heading.H1)`
  font-size: 16vw;
  letter-spacing: -2.5vw;
  @media (min-width: 800px) {
    font-size: 8rem;
    letter-spacing: -1.25rem;
  }
`

const StyledHeroSubHeading = styled(P.DefaultText)`
  font-size: 4vw;
  font-weight: 300;
  letter-spacing: -0.3vw;
  background: linear-gradient(to right, #d6e8d3, #b0d2ac);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  @media (min-width: 800px) {
    font-size: 2rem;
    letter-spacing: -0.15rem;
  }
`

const StyledHero = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5vw;
  margin-top: 4vw;
  @media (min-width: 800px) {
    gap: 2.5rem;
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
