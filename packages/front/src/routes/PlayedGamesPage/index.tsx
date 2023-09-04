import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Heading } from '../../components/Heading'
import { P } from '../../components/P'
import styled from 'styled-components'

const StyledPlayedGamesPage = styled.div``

export const PlayedGamesPage: FC = () => {
  const { gameType } = useParams()

  return (
    <StyledPlayedGamesPage>
      <Heading.H1>Recently completed matches</Heading.H1>
      <P.SmallText>{gameType}</P.SmallText>
    </StyledPlayedGamesPage>
  )
}
