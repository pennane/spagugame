import { ApolloClient, InMemoryCache, split, from } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'

import { createClient } from 'graphql-ws'
import { OperationTypeNode } from 'graphql'
import { createUploadLink } from 'apollo-upload-client'

const httpLink = new BatchHttpLink({
  uri: `${import.meta.env.VITE_SERVER_BASE_URL}/graphql`,
  batchMax: 5,
  batchInterval: 20,
  credentials: 'include'
})

const uploadLink = createUploadLink({
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

const uploadSplitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      (definition.kind === 'OperationDefinition' &&
        definition.operation === OperationTypeNode.MUTATION &&
        definition.variableDefinitions &&
        definition.variableDefinitions.some(
          ({ type }) => (type as any)?.type === 'Upload'
        )) ||
      false
    )
  },
  uploadLink,
  httpLink
)

const wsSplitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === OperationTypeNode.SUBSCRIPTION
    )
  },
  wsLink,
  uploadSplitLink
)

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([uploadLink, wsSplitLink])
})
