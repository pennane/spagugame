import * as Types from '../../../../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PlayedGamePlayerQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type PlayedGamePlayerQuery = { __typename?: 'Query', user?: { __typename?: 'User', _id: string, userName: string, githubId: string } | null };


export const PlayedGamePlayerDocument = gql`
    query PlayedGamePlayer($userId: ID!) {
  user(id: $userId) {
    _id
    userName
    githubId
  }
}
    `;

/**
 * __usePlayedGamePlayerQuery__
 *
 * To run a query within a React component, call `usePlayedGamePlayerQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlayedGamePlayerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayedGamePlayerQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function usePlayedGamePlayerQuery(baseOptions: Apollo.QueryHookOptions<PlayedGamePlayerQuery, PlayedGamePlayerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlayedGamePlayerQuery, PlayedGamePlayerQueryVariables>(PlayedGamePlayerDocument, options);
      }
export function usePlayedGamePlayerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlayedGamePlayerQuery, PlayedGamePlayerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlayedGamePlayerQuery, PlayedGamePlayerQueryVariables>(PlayedGamePlayerDocument, options);
        }
export type PlayedGamePlayerQueryHookResult = ReturnType<typeof usePlayedGamePlayerQuery>;
export type PlayedGamePlayerLazyQueryHookResult = ReturnType<typeof usePlayedGamePlayerLazyQuery>;
export type PlayedGamePlayerQueryResult = Apollo.QueryResult<PlayedGamePlayerQuery, PlayedGamePlayerQueryVariables>;