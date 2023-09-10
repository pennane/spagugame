import * as Types from '../../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LeaderboardPlayerFragment = { __typename?: 'LeaderboardPlayer', _id: string, githubId?: string | null, userName?: string | null, totalWins: number, totalPlayed: number, elo: number };

export type LeaderboardsLeaderboardFragment = { __typename?: 'Leaderboard', _id: string, updatedAt: Date, gameType: Types.GameType, players: Array<{ __typename?: 'LeaderboardPlayer', _id: string, githubId?: string | null, userName?: string | null, totalWins: number, totalPlayed: number, elo: number }> };

export type LeaderboardsQueryVariables = Types.Exact<{
  gameTypes: Array<Types.GameType> | Types.GameType;
}>;


export type LeaderboardsQuery = { __typename?: 'Query', leaderboards: Array<{ __typename?: 'Leaderboard', _id: string, updatedAt: Date, gameType: Types.GameType, players: Array<{ __typename?: 'LeaderboardPlayer', _id: string, githubId?: string | null, userName?: string | null, totalWins: number, totalPlayed: number, elo: number }> }> };

export const LeaderboardPlayerFragmentDoc = gql`
    fragment LeaderboardPlayer on LeaderboardPlayer {
  _id
  githubId
  userName
  totalWins
  totalPlayed
  elo
}
    `;
export const LeaderboardsLeaderboardFragmentDoc = gql`
    fragment LeaderboardsLeaderboard on Leaderboard {
  _id
  updatedAt
  gameType
  players {
    ...LeaderboardPlayer
  }
}
    ${LeaderboardPlayerFragmentDoc}`;
export const LeaderboardsDocument = gql`
    query Leaderboards($gameTypes: [GameType!]!) {
  leaderboards(gameTypes: $gameTypes) {
    ...LeaderboardsLeaderboard
  }
}
    ${LeaderboardsLeaderboardFragmentDoc}`;

/**
 * __useLeaderboardsQuery__
 *
 * To run a query within a React component, call `useLeaderboardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLeaderboardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLeaderboardsQuery({
 *   variables: {
 *      gameTypes: // value for 'gameTypes'
 *   },
 * });
 */
export function useLeaderboardsQuery(baseOptions: Apollo.QueryHookOptions<LeaderboardsQuery, LeaderboardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LeaderboardsQuery, LeaderboardsQueryVariables>(LeaderboardsDocument, options);
      }
export function useLeaderboardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LeaderboardsQuery, LeaderboardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LeaderboardsQuery, LeaderboardsQueryVariables>(LeaderboardsDocument, options);
        }
export type LeaderboardsQueryHookResult = ReturnType<typeof useLeaderboardsQuery>;
export type LeaderboardsLazyQueryHookResult = ReturnType<typeof useLeaderboardsLazyQuery>;
export type LeaderboardsQueryResult = Apollo.QueryResult<LeaderboardsQuery, LeaderboardsQueryVariables>;