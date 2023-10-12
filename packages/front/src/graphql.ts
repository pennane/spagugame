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

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})
