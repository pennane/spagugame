import * as Types from '../../../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type WinnersQueryVariables = Types.Exact<{
  userIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type WinnersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', githubId: string, _id: string, userName: string, profilePicture?: { __typename?: 'Image', url: string } | null }> };


export const WinnersDocument = gql`
    query Winners($userIds: [ID!]!) {
  users(ids: $userIds) {
    githubId
    _id
    userName
    profilePicture {
      url
    }
  }
}
    `;

/**
 * __useWinnersQuery__
 *
 * To run a query within a React component, call `useWinnersQuery` and pass it any options that fit your needs.
 * When your component renders, `useWinnersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWinnersQuery({
 *   variables: {
 *      userIds: // value for 'userIds'
 *   },
 * });
 */
export function useWinnersQuery(baseOptions: Apollo.QueryHookOptions<WinnersQuery, WinnersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WinnersQuery, WinnersQueryVariables>(WinnersDocument, options);
      }
export function useWinnersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WinnersQuery, WinnersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WinnersQuery, WinnersQueryVariables>(WinnersDocument, options);
        }
export type WinnersQueryHookResult = ReturnType<typeof useWinnersQuery>;
export type WinnersLazyQueryHookResult = ReturnType<typeof useWinnersLazyQuery>;
export type WinnersQueryResult = Apollo.QueryResult<WinnersQuery, WinnersQueryVariables>;