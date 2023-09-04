import styled from 'styled-components'

const H1 = styled.h1`
  color: ${({ theme }) => theme.colors.foreground.primary};
  font-size: 4rem;
  margin: 0;
  font-weight: 900;
  letter-spacing: -0.4rem;
  line-height: 1;
`

const H2 = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.foreground.primary};
  margin: 0;

  letter-spacing: -0.15rem;
  font-weight: 700;
  line-height: 1;
`
const H3 = styled.h3`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.foreground.primary};
  margin: 0;
  font-weight: 700;
  line-height: 1;
`

export const Heading = { H1, H2, H3 }
