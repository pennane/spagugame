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

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'include'
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:3000/graphql'
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
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
    children: [{ path: '', element: <LandingPage /> }]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <CurrentUserContextProvider>
        <RouterProvider router={router} />
      </CurrentUserContextProvider>
    </ApolloProvider>
  </React.StrictMode>
)
