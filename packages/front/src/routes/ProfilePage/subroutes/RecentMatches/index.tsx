import { FC } from 'react'
import { Section, useProfileUser } from '../..'
import { Heading } from '../../../../components/Heading'
import { PlayedGame } from '../../../PlayedGamesPage'
import styled from 'styled-components'

const StyledRecentMatches = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const RecentMatches: FC = () => {
  const { user: profileUser } = useProfileUser()

  return (
    <Section>
      <Heading.H2>Recent matches:</Heading.H2>
      <StyledRecentMatches>
        {profileUser?.playedGames.map((game) => {
          const playerIndex = game.players.findIndex(
            (p) => p._id === profileUser._id
          )
          const eloChange =
            playerIndex !== -1
              ? Math.floor(
                  game.playerElosAfter[playerIndex] -
                    game.playerElosBefore[playerIndex]
                )
              : undefined

          return (
            <PlayedGame
              key={game._id}
              game={game}
              profilePage
              eloChange={eloChange}
            />
          )
        })}
      </StyledRecentMatches>
    </Section>
  )
}
