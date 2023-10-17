import * as Types from '../../../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UserOngoingGameIdQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserOngoingGameIdQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', ongoingGameId?: string | null } | null };


export const UserOngoingGameIdDocument = gql`
    query UserOngoingGameId {
  currentUser {
    ongoingGameId
  }
}
    `;

/**
 * __useUserOngoingGameIdQuery__
 *
 * To run a query within a React component, call `useUserOngoingGameIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserOngoingGameIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserOngoingGameIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserOngoingGameIdQuery(baseOptions?: Apollo.QueryHookOptions<UserOngoingGameIdQuery, UserOngoingGameIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserOngoingGameIdQuery, UserOngoingGameIdQueryVariables>(UserOngoingGameIdDocument, options);
      }
export function useUserOngoingGameIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserOngoingGameIdQuery, UserOngoingGameIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserOngoingGameIdQuery, UserOngoingGameIdQueryVariables>(UserOngoingGameIdDocument, options);
        }
export type UserOngoingGameIdQueryHookResult = ReturnType<typeof useUserOngoingGameIdQuery>;
export type UserOngoingGameIdLazyQueryHookResult = ReturnType<typeof useUserOngoingGameIdLazyQuery>;
export type UserOngoingGameIdQueryResult = Apollo.QueryResult<UserOngoingGameIdQuery, UserOngoingGameIdQueryVariables>;