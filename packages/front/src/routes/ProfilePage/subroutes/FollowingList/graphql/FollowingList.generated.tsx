import * as Types from '../../../../../types';

import { gql } from '@apollo/client';
import { UserFollowingFragmentDoc } from '../../../graphql/ProfilePage.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FollowingListUserQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type FollowingListUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', _id: string, userName: string, profilePicture?: { __typename?: 'Image', url: string } | null, followers: Array<{ __typename?: 'User', _id: string, userName: string, githubId: string, profilePicture?: { __typename?: 'Image', url: string } | null }>, following: Array<{ __typename?: 'User', _id: string, userName: string, githubId: string, profilePicture?: { __typename?: 'Image', url: string } | null }> } | null };


export const FollowingListUserDocument = gql`
    query FollowingListUser($userId: ID!) {
  user(id: $userId) {
    _id
    userName
    profilePicture {
      url
    }
    ...UserFollowing
  }
}
    ${UserFollowingFragmentDoc}`;

/**
 * __useFollowingListUserQuery__
 *
 * To run a query within a React component, call `useFollowingListUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFollowingListUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFollowingListUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useFollowingListUserQuery(baseOptions: Apollo.QueryHookOptions<FollowingListUserQuery, FollowingListUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FollowingListUserQuery, FollowingListUserQueryVariables>(FollowingListUserDocument, options);
      }
export function useFollowingListUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FollowingListUserQuery, FollowingListUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FollowingListUserQuery, FollowingListUserQueryVariables>(FollowingListUserDocument, options);
        }
export type FollowingListUserQueryHookResult = ReturnType<typeof useFollowingListUserQuery>;
export type FollowingListUserLazyQueryHookResult = ReturnType<typeof useFollowingListUserLazyQuery>;
export type FollowingListUserQueryResult = Apollo.QueryResult<FollowingListUserQuery, FollowingListUserQueryVariables>;