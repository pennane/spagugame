import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { ErrorPage } from './routes/ErrorPage'
import { LandingPage } from './routes/LandingPage'
import { Root } from './routes/Root'
import { CurrentUserContextProvider } from './hooks/useCurrentUser/context'

const link = createHttpLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'include'
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
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
