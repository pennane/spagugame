import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { CurrentUserContextProvider } from './hooks/useCurrentUser/context'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { SoundContextProvider } from './hooks/usePlaySound/context'
import { ApolloProvider } from '@apollo/client'

import { theme } from './theme'
import { router } from './router'
import { client } from './graphql'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <CurrentUserContextProvider>
        <SoundContextProvider>
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </SoundContextProvider>
      </CurrentUserContextProvider>
    </ApolloProvider>
  </React.StrictMode>
)
