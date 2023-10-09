import * as Types from '../../../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type OngoingGameUserStatsFragment = { __typename?: 'UserStats', _id: string, userId: string, gameType: Types.GameType, elo: number };

export type OngoingGamePlayerProfileFragment = { __typename?: 'User', _id: string, githubId: string, userName: string, profilePicture?: { __typename?: 'Image', url: string } | null };

export type GamePlayerProfilesQueryVariables = Types.Exact<{
  userIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  gameType: Types.GameType;
}>;


export type GamePlayerProfilesQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', _id: string, githubId: string, userName: string, profilePicture?: { __typename?: 'Image', url: string } | null }>, usersStats: Array<{ __typename?: 'UserStats', _id: string, userId: string, gameType: Types.GameType, elo: number }> };

export const OngoingGameUserStatsFragmentDoc = gql`
    fragment OngoingGameUserStats on UserStats {
  _id
  userId
  gameType
  elo
}
    `;
export const OngoingGamePlayerProfileFragmentDoc = gql`
    fragment OngoingGamePlayerProfile on User {
  _id
  githubId
  userName
  profilePicture {
    url
  }
}
    `;
export const GamePlayerProfilesDocument = gql`
    query GamePlayerProfiles($userIds: [ID!]!, $gameType: GameType!) {
  users(ids: $userIds) {
    ...OngoingGamePlayerProfile
  }
  usersStats(gameType: $gameType, userIds: $userIds) {
    ...OngoingGameUserStats
  }
}
    ${OngoingGamePlayerProfileFragmentDoc}
${OngoingGameUserStatsFragmentDoc}`;

/**
 * __useGamePlayerProfilesQuery__
 *
 * To run a query within a React component, call `useGamePlayerProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGamePlayerProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGamePlayerProfilesQuery({
 *   variables: {
 *      userIds: // value for 'userIds'
 *      gameType: // value for 'gameType'
 *   },
 * });
 */
export function useGamePlayerProfilesQuery(baseOptions: Apollo.QueryHookOptions<GamePlayerProfilesQuery, GamePlayerProfilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GamePlayerProfilesQuery, GamePlayerProfilesQueryVariables>(GamePlayerProfilesDocument, options);
      }
export function useGamePlayerProfilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GamePlayerProfilesQuery, GamePlayerProfilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GamePlayerProfilesQuery, GamePlayerProfilesQueryVariables>(GamePlayerProfilesDocument, options);
        }
export type GamePlayerProfilesQueryHookResult = ReturnType<typeof useGamePlayerProfilesQuery>;
export type GamePlayerProfilesLazyQueryHookResult = ReturnType<typeof useGamePlayerProfilesLazyQuery>;
export type GamePlayerProfilesQueryResult = Apollo.QueryResult<GamePlayerProfilesQuery, GamePlayerProfilesQueryVariables>;