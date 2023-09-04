import styled from 'styled-components'
import { GameBanner } from '../../../../components/GameBanner'

import { useGamesQuery } from '../../../LandingPage/graphql/Games.generated'

const StyledGameBannerContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

export const Games = () => {
  const { data, loading } = useGamesQuery()
  const games = data?.games

  return (
    <StyledGameBannerContainer>
      {loading && 'loading...'}
      {!loading && !games && 'no data'}
      {!loading &&
        games &&
        games.map((game) => <GameBanner key={game._id} game={game} />)}
    </StyledGameBannerContainer>
  )
}
