import * as Types from '../../../types';

import { gql } from '@apollo/client';
import { ProfilePageUserFragmentDoc } from '../../../routes/ProfilePage/graphql/ProfilePage.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CurrentUserQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', _id: string, githubId: string, userName: string, profilePicture?: { __typename?: 'Image', id: string, hash?: string | null, url: string } | null, stats: Array<{ __typename?: 'UserStats', _id: string, userId: string, gameType: Types.GameType, totalWins: number, totalPlayed: number, elo: number }>, playedGames: Array<{ __typename?: 'PlayedGame', _id: string, gameType: Types.GameType, playerScores: Array<number>, playerElosBefore: Array<number>, playerElosAfter: Array<number>, startedAt: Date, finishedAt: Date, finalState?: string | null, ongoingGameId?: string | null, players: Array<{ __typename?: 'User', _id: string, githubId: string, userName: string }> }>, achievements: Array<{ __typename?: 'Achievement', _id: string, name: string, description: string, criteria: { __typename?: 'LeaderboardRankUnlockCriteria', gameType?: Types.GameType | null, rank: number } | { __typename?: 'OtherUnlockCriteria', gameType?: Types.GameType | null } | { __typename?: 'TotalPlayedUnlockCriteria', gameType?: Types.GameType | null, played: number } | { __typename?: 'TotalWinsUnlockCriteria', gameType?: Types.GameType | null, wins: number } | { __typename?: 'WinStreakUnlockCriteria', gameType?: Types.GameType | null, streak: number } }>, followers: Array<{ __typename?: 'User', _id: string, userName: string, githubId: string }>, following: Array<{ __typename?: 'User', _id: string, userName: string, githubId: string }> } | null };


export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    ...ProfilePageUser
  }
}
    ${ProfilePageUserFragmentDoc}`;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;