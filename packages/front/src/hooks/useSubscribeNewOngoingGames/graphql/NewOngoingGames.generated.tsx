import * as Types from '../../../types';

import { gql } from '@apollo/client';
import { OngoingGameFragmentDoc } from '../../../games/graphql/OngoingGame.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NewOngoingGamesSubscriptionVariables = Types.Exact<{
  gameType?: Types.InputMaybe<Types.GameType>;
}>;


export type NewOngoingGamesSubscription = { __typename?: 'Subscription', newOngoingGame: { __typename?: 'OngoingGame', _id: string, gameType: Types.GameType, processState: Types.OngoingGameProcessState, jsonState: string, currentTurn?: string | null, startedAt?: number | null, startsIn?: number | null, isPrivate: boolean, playedGameId?: string | null, winnerIds?: Array<string> | null, players: Array<{ __typename?: 'OngoingGamePlayer', score: number, userId: string, ready: boolean }> } };


export const NewOngoingGamesDocument = gql`
    subscription NewOngoingGames($gameType: GameType) {
  newOngoingGame(gameType: $gameType) {
    ...OngoingGame
  }
}
    ${OngoingGameFragmentDoc}`;

/**
 * __useNewOngoingGamesSubscription__
 *
 * To run a query within a React component, call `useNewOngoingGamesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewOngoingGamesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewOngoingGamesSubscription({
 *   variables: {
 *      gameType: // value for 'gameType'
 *   },
 * });
 */
export function useNewOngoingGamesSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NewOngoingGamesSubscription, NewOngoingGamesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewOngoingGamesSubscription, NewOngoingGamesSubscriptionVariables>(NewOngoingGamesDocument, options);
      }
export type NewOngoingGamesSubscriptionHookResult = ReturnType<typeof useNewOngoingGamesSubscription>;
export type NewOngoingGamesSubscriptionResult = Apollo.SubscriptionResult<NewOngoingGamesSubscription>;