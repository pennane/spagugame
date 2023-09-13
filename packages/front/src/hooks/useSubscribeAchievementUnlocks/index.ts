import { useAchievementUnlocksSubscription } from './graphql/AchievementUnlocks.generated'
import { useCurrentUser } from '../useCurrentUser'
import { ProfilePageUserDocument } from '../../routes/ProfilePage/graphql/ProfilePage.generated'
import { toast } from 'react-toastify'
import { usePlaySound } from '../usePlaySound'

export const useSubscribeAchievementUnlocks = () => {
  const currentUser = useCurrentUser()
  const currentUserId = currentUser?._id
  const playSound = usePlaySound()

  useAchievementUnlocksSubscription({
    skip: !currentUserId,
    variables: { userId: currentUserId! },
    onData: ({ client, data }) => {
      const achievements = data.data?.achievementUnlock
      if (!achievements || achievements.length === 0) return

      playSound('unlock')

      achievements.forEach((a) => toast(`🏆 ${a.name} unlocked`))

      client.cache.updateQuery(
        {
          query: ProfilePageUserDocument,
          variables: { userId: currentUserId! }
        },
        (data) => {
          return {
            user: {
              ...data.user,
              achievements: [...data.user.achievements, ...achievements]
            }
          }
        }
      )
    }
  })
}
