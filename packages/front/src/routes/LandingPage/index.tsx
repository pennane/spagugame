import styled from 'styled-components'
import { useGamesQuery } from './graphql/Games.generated'
import { Link } from 'react-router-dom'
const StyledLandingPage = styled.div``

export const LandingPage = () => {
  const { data, loading } = useGamesQuery()

  return (
    <StyledLandingPage>
      {loading && 'loading...'}
      {!loading && !data && 'no data'}
      {!loading && data && (
        <>
          <p>Game types:</p>
          {data.games.map((game) => (
            <div key={game._id}>
              <Link to={`/game/${game.type}`}>
                <p>{game.name}</p>
              </Link>
            </div>
          ))}
          <p>Current games:</p>
          {data.games.map((game) =>
            game.ongoingGames.map((ongoingGame) => (
              <Link
                key={ongoingGame._id}
                to={`/game/${game.type}/${ongoingGame._id}`}
              >
                <p>
                  {game.name} ({ongoingGame.players.length} / {game.maxPlayers}{' '}
                  players)
                </p>
              </Link>
            ))
          )}
        </>
      )}
    </StyledLandingPage>
  )
}
