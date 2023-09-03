import styled from 'styled-components'
import { useGameQuery, useNewGameMutation } from './graphql/Game.generated'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GameType } from '../../types'
import { Button } from '../../components/Button'

const StyledGamePage = styled.div``

const isGameType = (gameType?: string): gameType is GameType =>
  Object.values(GameType).includes(gameType as GameType)

export const GamePage = () => {
  const navigate = useNavigate()

  const { gameType: rawGameType } = useParams()
  const gameType = isGameType(rawGameType) ? rawGameType : undefined
  const { data, loading } = useGameQuery({
    variables: { gameType: gameType as GameType },
    skip: !gameType
  })

  const [mutation] = useNewGameMutation()

  const handleCreateNewGame = () => {
    if (!gameType) return
    mutation({ variables: { gameType } }).then((res) => {
      res.data?.createOngoingGame._id &&
        navigate(`/game/${gameType}/${res.data.createOngoingGame._id}`)
    })
  }

  if (loading) return <div>loading...</div>
  const game = data?.game

  if (!game) return <div>Game does not exist</div>

  const hasOngoingGames = game.ongoingGames.length > 0

  return (
    <StyledGamePage>
      <h1>{game.name}</h1>
      <h2>
        {' '}
        {game.maxPlayers === game.minPlayers && (
          <p>For {game.maxPlayers} players</p>
        )}
        {game.maxPlayers !== game.minPlayers && (
          <p>
            For {game.minPlayers}-${game.maxPlayers} players
          </p>
        )}
      </h2>
      <p>{game.description}</p>

      <Button onClick={handleCreateNewGame}>Create new game</Button>

      <h2>Currently going games:</h2>
      {hasOngoingGames && (
        <ul>
          {game.ongoingGames.map((ongoingGame) => (
            <Link
              key={ongoingGame._id}
              to={`/game/${game.type}/${ongoingGame._id}`}
            >
              <p>
                {game.name} ({ongoingGame.players.length} / {game.maxPlayers}{' '}
                players)
              </p>
            </Link>
          ))}
        </ul>
      )}
      {!hasOngoingGames && (
        <p>No ongoing games. You could create one instead.</p>
      )}
    </StyledGamePage>
  )
}
