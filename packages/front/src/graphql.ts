import { ApolloClient, InMemoryCache, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'

import { createClient } from 'graphql-ws'
import { OperationTypeNode } from 'graphql'
import { createUploadLink } from 'apollo-upload-client'

const httpLink = createUploadLink({
  uri: `${import.meta.env.VITE_SERVER_BASE_URL}/graphql`,
  credentials: 'include',
  headers: {
    'Apollo-Require-Preflight': 'true'
  }
})

const RECONNECT_INDICATOR_DELAY_MS = 800

let showReconnecting = false
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
const listeners = new Set<() => void>()

const setShowReconnecting = (value: boolean) => {
  if (showReconnecting === value) return
  showReconnecting = value
  listeners.forEach((listener) => listener())
}

const onConnected = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  setShowReconnecting(false)
}

const onDisconnected = () => {
  if (reconnectTimer || showReconnecting) return
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    setShowReconnecting(true)
  }, RECONNECT_INDICATOR_DELAY_MS)
}

export const getShowReconnecting = (): boolean => showReconnecting

export const subscribeToConnectionState = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

let refetchLiveState: () => void = () => {}
let hasConnectedOnce = false

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${import.meta.env.VITE_WS_BASE_URL}/graphql`,
    lazy: false,
    retryAttempts: Infinity,
    shouldRetry: () => true,
    keepAlive: 10_000,
    on: {
      connecting: onDisconnected,
      connected: () => {
        onConnected()
        if (hasConnectedOnce) refetchLiveState()
        hasConnectedOnce = true
      },
      closed: onDisconnected
    }
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

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

refetchLiveState = () => {
  client.refetchQueries({ include: 'active' })
}
