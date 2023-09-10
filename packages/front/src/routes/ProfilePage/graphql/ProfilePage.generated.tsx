import * as Types from '../../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ProfilePageUserStatsFragment = { __typename?: 'UserStats', _id: string, userId: string, gameType: Types.GameType, totalWins: number, totalPlayed: number, elo: number };

export type ProfilePageUserPlayedGameFragment = { __typename?: 'PlayedGame', _id: string, gameType: Types.GameType, playerIds: Array<string>, playerScores: Array<number>, playerElosBefore: Array<number>, playerElosAfter: Array<number>, startedAt: Date, finishedAt: Date, finalState?: string | null };

export type ProfilePageUserQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type ProfilePageUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', _id: string, githubId: string, userName: string, stats: Array<{ __typename?: 'UserStats', _id: string, userId: string, gameType: Types.GameType, totalWins: number, totalPlayed: number, elo: number }>, playedGames: Array<{ __typename?: 'PlayedGame', _id: string, gameType: Types.GameType, playerIds: Array<string>, playerScores: Array<number>, playerElosBefore: Array<number>, playerElosAfter: Array<number>, startedAt: Date, finishedAt: Date, finalState?: string | null }> } | null };

export const ProfilePageUserStatsFragmentDoc = gql`
    fragment ProfilePageUserStats on UserStats {
  _id
  userId
  gameType
  totalWins
  totalPlayed
  elo
}
    `;
export const ProfilePageUserPlayedGameFragmentDoc = gql`
    fragment ProfilePageUserPlayedGame on PlayedGame {
  _id
  gameType
  playerIds
  playerScores
  playerElosBefore
  playerElosAfter
  startedAt
  finishedAt
  finalState
}
    `;
export const ProfilePageUserDocument = gql`
    query ProfilePageUser($userId: ID!) {
  user(id: $userId) {
    _id
    githubId
    userName
    stats {
      ...ProfilePageUserStats
    }
    playedGames {
      ...ProfilePageUserPlayedGame
    }
  }
}
    ${ProfilePageUserStatsFragmentDoc}
${ProfilePageUserPlayedGameFragmentDoc}`;

/**
 * __useProfilePageUserQuery__
 *
 * To run a query within a React component, call `useProfilePageUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfilePageUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfilePageUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useProfilePageUserQuery(baseOptions: Apollo.QueryHookOptions<ProfilePageUserQuery, ProfilePageUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProfilePageUserQuery, ProfilePageUserQueryVariables>(ProfilePageUserDocument, options);
      }
export function useProfilePageUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfilePageUserQuery, ProfilePageUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProfilePageUserQuery, ProfilePageUserQueryVariables>(ProfilePageUserDocument, options);
        }
export type ProfilePageUserQueryHookResult = ReturnType<typeof useProfilePageUserQuery>;
export type ProfilePageUserLazyQueryHookResult = ReturnType<typeof useProfilePageUserLazyQuery>;
export type ProfilePageUserQueryResult = Apollo.QueryResult<ProfilePageUserQuery, ProfilePageUserQueryVariables>;