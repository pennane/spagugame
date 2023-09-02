import * as Types from '../../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TestCounterSubscriptionVariables = Types.Exact<{ [key: string]: never; }>;


export type TestCounterSubscription = { __typename?: 'Subscription', testCounter: number };


export const TestCounterDocument = gql`
    subscription TestCounter {
  testCounter
}
    `;

/**
 * __useTestCounterSubscription__
 *
 * To run a query within a React component, call `useTestCounterSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTestCounterSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTestCounterSubscription({
 *   variables: {
 *   },
 * });
 */
export function useTestCounterSubscription(baseOptions?: Apollo.SubscriptionHookOptions<TestCounterSubscription, TestCounterSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TestCounterSubscription, TestCounterSubscriptionVariables>(TestCounterDocument, options);
      }
export type TestCounterSubscriptionHookResult = ReturnType<typeof useTestCounterSubscription>;
export type TestCounterSubscriptionResult = Apollo.SubscriptionResult<TestCounterSubscription>;