import styled from 'styled-components'
import { GameBanner } from '../../../../components/GameBanner'

import { useGamesQuery } from '../../../LandingPage/graphql/Games.generated'
import { P } from '../../../../components/P'

const StyledGameBannerContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
`

export const Games = () => {
  const { data, loading } = useGamesQuery({ pollInterval: 10000 })
  const games = data?.games

  return (
    <StyledGameBannerContainer>
      {loading && <P.DefaultText>loading...</P.DefaultText>}
      {!loading && !games && (
        <P.DefaultText>no games, spagu-server might be off</P.DefaultText>
      )}
      {!loading &&
        games &&
        games.map((game, i) => <GameBanner key={i} game={game} />)}
    </StyledGameBannerContainer>
  )
}
