import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { ErrorPage } from './routes/ErrorPage'
import { LandingPage } from './routes/LandingPage'
import { Root } from './routes/Root'
import { CurrentUserContextProvider } from './hooks/useCurrentUser/context'
import { OperationTypeNode } from 'graphql'
import { GamePage } from './routes/GamePage'
import { OngoingGamePage } from './routes/OngoingGamePage'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme'
import { GamesPage } from './routes/GamesPage'
import { ProfilePage } from './routes/ProfilePage'
import { PlayedGamesPage } from './routes/PlayedGamesPage'
import { PlayedGamePage } from './routes/PlayedGamePage'
import { LeaderboardPage } from './routes/LeaderboardPage'

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_SERVER_BASE_URL}/graphql`,
  credentials: 'include'
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${import.meta.env.VITE_WS_BASE_URL}/graphql`
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === OperationTypeNode.SUBSCRIPTION
    )
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

const router = createBrowserRouter([
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
      { path: 'profile/:userId?', element: <ProfilePage /> },
      { path: 'played/:gameType?', element: <PlayedGamesPage /> },
      { path: 'played/:gameType/:gameId', element: <PlayedGamePage /> },
      { path: 'leaderboards', element: <LeaderboardPage /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <CurrentUserContextProvider>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </CurrentUserContextProvider>
    </ApolloProvider>
  </React.StrictMode>
)
