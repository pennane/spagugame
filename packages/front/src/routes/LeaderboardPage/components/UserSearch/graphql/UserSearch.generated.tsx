import * as Types from '../../../../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FindUsersUserFragment = { __typename?: 'User', _id: string, githubId: string, userName: string };

export type FindUsersQueryVariables = Types.Exact<{
  nameIncludes: Types.Scalars['String']['input'];
}>;


export type FindUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', _id: string, githubId: string, userName: string }> };

export const FindUsersUserFragmentDoc = gql`
    fragment FindUsersUser on User {
  _id
  githubId
  userName
}
    `;
export const FindUsersDocument = gql`
    query FindUsers($nameIncludes: String!) {
  users(nameIncludes: $nameIncludes) {
    ...FindUsersUser
  }
}
    ${FindUsersUserFragmentDoc}`;

/**
 * __useFindUsersQuery__
 *
 * To run a query within a React component, call `useFindUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindUsersQuery({
 *   variables: {
 *      nameIncludes: // value for 'nameIncludes'
 *   },
 * });
 */
export function useFindUsersQuery(baseOptions: Apollo.QueryHookOptions<FindUsersQuery, FindUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindUsersQuery, FindUsersQueryVariables>(FindUsersDocument, options);
      }
export function useFindUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindUsersQuery, FindUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindUsersQuery, FindUsersQueryVariables>(FindUsersDocument, options);
        }
export type FindUsersQueryHookResult = ReturnType<typeof useFindUsersQuery>;
export type FindUsersLazyQueryHookResult = ReturnType<typeof useFindUsersLazyQuery>;
export type FindUsersQueryResult = Apollo.QueryResult<FindUsersQuery, FindUsersQueryVariables>;