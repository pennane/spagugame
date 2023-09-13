import { createBrowserRouter } from 'react-router-dom'
import { ErrorPage } from './routes/ErrorPage'
import { GamePage } from './routes/GamePage'
import { GamesPage } from './routes/GamesPage'
import { LandingPage } from './routes/LandingPage'
import { LeaderboardPage } from './routes/LeaderboardPage'
import { OngoingGamePage } from './routes/OngoingGamePage'
import { PlayedGamePage } from './routes/PlayedGamePage'
import { PlayedGamesPage } from './routes/PlayedGamesPage'
import { ProfilePage } from './routes/ProfilePage'
import { FollowingList } from './routes/ProfilePage/subroutes/FollowingList'
import { Root } from './routes/Root'
import { Stats } from './routes/ProfilePage/subroutes/Stats'
import { RecentMatches } from './routes/ProfilePage/subroutes/RecentMatches'
import { Achievements } from './routes/ProfilePage/subroutes/Achievements'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: '', element: <LandingPage /> },
      {
        path: 'game',
        element: <GamesPage />
      },
      {
        path: 'game/:gameType',
        element: <GamePage />
      },
      { path: 'game/:gameType/:gameId', element: <OngoingGamePage /> },
      {
        path: 'profile/:userId?',
        element: <ProfilePage />,
        children: [
          { path: '', element: <Stats /> },
          { path: 'stats', element: <Stats /> },
          { path: 'following', element: <FollowingList /> },
          { path: 'followers', element: <FollowingList /> },
          { path: 'recent', element: <RecentMatches /> },
          { path: 'achievements', element: <Achievements /> }
        ]
      },
      { path: 'played/:gameType?', element: <PlayedGamesPage /> },
      { path: 'played/:gameType/:gameId', element: <PlayedGamePage /> },
      { path: 'leaderboards', element: <LeaderboardPage /> }
    ]
  }
])
