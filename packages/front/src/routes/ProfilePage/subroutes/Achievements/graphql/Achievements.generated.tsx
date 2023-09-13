import * as Types from '../../../../../types';

import { gql } from '@apollo/client';
import { ProfilePageUserAchievementFragmentDoc } from '../../../graphql/ProfilePage.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AllAchievementsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AllAchievementsQuery = { __typename?: 'Query', achievements: Array<{ __typename?: 'Achievement', _id: string, name: string, description: string, criteria: { __typename?: 'LeaderboardRankUnlockCriteria', gameType?: Types.GameType | null, rank: number } | { __typename?: 'OtherUnlockCriteria', gameType?: Types.GameType | null } | { __typename?: 'TotalPlayedUnlockCriteria', gameType?: Types.GameType | null, played: number } | { __typename?: 'TotalWinsUnlockCriteria', gameType?: Types.GameType | null, wins: number } | { __typename?: 'WinStreakUnlockCriteria', gameType?: Types.GameType | null, streak: number } }> };


export const AllAchievementsDocument = gql`
    query AllAchievements {
  achievements {
    ...ProfilePageUserAchievement
  }
}
    ${ProfilePageUserAchievementFragmentDoc}`;

/**
 * __useAllAchievementsQuery__
 *
 * To run a query within a React component, call `useAllAchievementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllAchievementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllAchievementsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllAchievementsQuery(baseOptions?: Apollo.QueryHookOptions<AllAchievementsQuery, AllAchievementsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllAchievementsQuery, AllAchievementsQueryVariables>(AllAchievementsDocument, options);
      }
export function useAllAchievementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllAchievementsQuery, AllAchievementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllAchievementsQuery, AllAchievementsQueryVariables>(AllAchievementsDocument, options);
        }
export type AllAchievementsQueryHookResult = ReturnType<typeof useAllAchievementsQuery>;
export type AllAchievementsLazyQueryHookResult = ReturnType<typeof useAllAchievementsLazyQuery>;
export type AllAchievementsQueryResult = Apollo.QueryResult<AllAchievementsQuery, AllAchievementsQueryVariables>;