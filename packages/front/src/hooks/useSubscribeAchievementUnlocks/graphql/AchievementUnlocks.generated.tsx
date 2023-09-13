import * as Types from '../../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AchievementUnlocksSubscriptionVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type AchievementUnlocksSubscription = { __typename?: 'Subscription', achievementUnlock: Array<{ __typename?: 'Achievement', _id: string, name: string, description: string }> };


export const AchievementUnlocksDocument = gql`
    subscription AchievementUnlocks($userId: ID!) {
  achievementUnlock(userId: $userId) {
    _id
    name
    description
  }
}
    `;

/**
 * __useAchievementUnlocksSubscription__
 *
 * To run a query within a React component, call `useAchievementUnlocksSubscription` and pass it any options that fit your needs.
 * When your component renders, `useAchievementUnlocksSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAchievementUnlocksSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useAchievementUnlocksSubscription(baseOptions: Apollo.SubscriptionHookOptions<AchievementUnlocksSubscription, AchievementUnlocksSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<AchievementUnlocksSubscription, AchievementUnlocksSubscriptionVariables>(AchievementUnlocksDocument, options);
      }
export type AchievementUnlocksSubscriptionHookResult = ReturnType<typeof useAchievementUnlocksSubscription>;
export type AchievementUnlocksSubscriptionResult = Apollo.SubscriptionResult<AchievementUnlocksSubscription>;