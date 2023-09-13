import styled, { css } from 'styled-components'
import { FC } from 'react'
import { useAllAchievementsQuery } from './graphql/Achievements.generated'
import { P } from '../../../../components/P'
import { Section, useProfileUser } from '../..'
import { Heading } from '../../../../components/Heading'

const StyledAchievements = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.25rem;
`

const lockedCss = css`
  border-color: #010906;
  color: #353535;
  background-color: rgba(0, 0, 0, 0.4);
  box-shadow: none;
  font-weight: 200;
`

const StyledAchievement = styled.div<{ $locked: boolean }>`
  border: 3px solid ${({ theme }) => theme.colors.foreground.success};
  color: ${({ theme }) => theme.colors.foreground.success};
  text-transform: uppercase;
  box-shadow: inset 0 2px 5px 0 rgb(121 180 115 / 20%);

  height: 5rem;
  width: 5rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: 500;
  line-height: 1;
  font-size: 0.75rem;
  ${({ $locked }) => $locked && lockedCss}
`

export const Achievements: FC = () => {
  const { user: profileUser } = useProfileUser()

  const unlockedIds =
    profileUser?.achievements.map((achievement) => achievement._id) || []

  const { data: allAchievementsData, loading: allAchievementsLoading } =
    useAllAchievementsQuery()

  if (allAchievementsLoading) return <P.SmallText>Loading ...</P.SmallText>

  const allAchievements =
    allAchievementsData?.achievements || profileUser?.achievements
  return (
    <Section>
      <Heading.H2>Achievements:</Heading.H2>
      <StyledAchievements>
        {allAchievements?.map((achievement) => {
          return (
            <StyledAchievement
              title={achievement.description}
              $locked={!unlockedIds.includes(achievement._id)}
              key={achievement._id}
            >
              {achievement.name}
            </StyledAchievement>
          )
        })}
      </StyledAchievements>
    </Section>
  )
}
