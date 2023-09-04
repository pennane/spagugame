import { FC } from 'react'
import styled from 'styled-components'
import { Heading } from '../../components/Heading'
import { Games } from './components/Games'

const StyledGamesPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const GamesPage: FC = () => {
  return (
    <StyledGamesPage>
      <Heading.H2>Games</Heading.H2>
      <Games />
    </StyledGamesPage>
  )
}
