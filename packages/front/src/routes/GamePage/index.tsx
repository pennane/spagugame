import styled from 'styled-components'
import { useGameQuery, useNewGameMutation } from './graphql/Game.generated'
import { useNavigate, useParams } from 'react-router-dom'
import { GameType } from '../../types'
import { Button } from '../../components/Button'
import { Heading } from '../../components/Heading'
import { P } from '../../components/P'

import { Pill } from '../../components/Pill'
import { OngoingGameItem } from './components/OngoingGame'

const StyledGamePage = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.foreground.danger};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 10rem;
`

const StyledGameDescription = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
const StyledGameActions = styled.section``
const StyledGameOngoingGames = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

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
      <StyledGameDescription>
        <Heading.H1>{game.name}</Heading.H1>

        {game.maxPlayers === game.minPlayers && (
          <Pill color="info">{game.maxPlayers} players</Pill>
        )}
        {game.maxPlayers !== game.minPlayers && (
          <Pill color="primary">{game.maxPlayers} players</Pill>
        )}

        <P.SmallText>{game.description}</P.SmallText>
      </StyledGameDescription>
      <StyledGameActions>
        <Button onClick={handleCreateNewGame}>Create new game</Button>
      </StyledGameActions>
      <StyledGameOngoingGames>
        <Heading.H2>Currently going games:</Heading.H2>
        {hasOngoingGames &&
          game.ongoingGames.map((ongoingGame) => (
            <OngoingGameItem
              key={ongoingGame._id}
              game={game}
              ongoingGame={ongoingGame}
            />
          ))}
        {!hasOngoingGames && (
          <P.DefaultText>
            No ongoing games. You could create one instead.
          </P.DefaultText>
        )}
      </StyledGameOngoingGames>
    </StyledGamePage>
  )
}
