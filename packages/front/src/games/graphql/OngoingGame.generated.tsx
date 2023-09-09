import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type OngoingGameFragment = { __typename?: 'OngoingGame', _id: string, gameType: Types.GameType, processState: Types.OngoingGameProcessState, jsonState: string, currentTurn?: string | null, startedAt?: number | null, startsIn?: number | null, isPrivate: boolean, players: Array<{ __typename?: 'OngoingGamePlayer', score: number, userId: string, ready: boolean }> };

export type OngoingGameStateChangeFragment = { __typename?: 'OngoingGameStateChange', _id?: string | null, gameType?: Types.GameType | null, processState?: Types.OngoingGameProcessState | null, jsonState?: string | null, currentTurn?: string | null, startsIn?: number | null, players?: Array<{ __typename?: 'OngoingGamePlayer', score: number, userId: string, ready: boolean }> | null };

export type GetOngoingGameQueryVariables = Types.Exact<{
  ongoingGameId: Types.Scalars['ID']['input'];
}>;


export type GetOngoingGameQuery = { __typename?: 'Query', ongoingGame: { __typename?: 'OngoingGame', _id: string, gameType: Types.GameType, processState: Types.OngoingGameProcessState, jsonState: string, currentTurn?: string | null, startedAt?: number | null, startsIn?: number | null, isPrivate: boolean, players: Array<{ __typename?: 'OngoingGamePlayer', score: number, userId: string, ready: boolean }> } };

export type JoinGameMutationVariables = Types.Exact<{
  ongoingGameId: Types.Scalars['ID']['input'];
}>;


export type JoinGameMutation = { __typename?: 'Mutation', joinOngoingGame: { __typename?: 'OngoingGame', _id: string, gameType: Types.GameType, processState: Types.OngoingGameProcessState, jsonState: string, currentTurn?: string | null, startedAt?: number | null, startsIn?: number | null, isPrivate: boolean, players: Array<{ __typename?: 'OngoingGamePlayer', score: number, userId: string, ready: boolean }> } };

export type PlayMoveMutationVariables = Types.Exact<{
  ongoingGameId: Types.Scalars['ID']['input'];
  move: Types.Scalars['String']['input'];
}>;


export type PlayMoveMutation = { __typename?: 'Mutation', playTurn: { __typename?: 'OngoingGame', _id: string, gameType: Types.GameType, processState: Types.OngoingGameProcessState, jsonState: string, currentTurn?: string | null, startedAt?: number | null, startsIn?: number | null, isPrivate: boolean, players: Array<{ __typename?: 'OngoingGamePlayer', score: number, userId: string, ready: boolean }> } };

export type ToggleReadyMutationVariables = Types.Exact<{
  ongoingGameId: Types.Scalars['ID']['input'];
  ready: Types.Scalars['Boolean']['input'];
}>;


export type ToggleReadyMutation = { __typename?: 'Mutation', toggleReady: { __typename?: 'OngoingGame', _id: string, gameType: Types.GameType, processState: Types.OngoingGameProcessState, jsonState: string, currentTurn?: string | null, startedAt?: number | null, startsIn?: number | null, isPrivate: boolean, players: Array<{ __typename?: 'OngoingGamePlayer', score: number, userId: string, ready: boolean }> } };

export type LeaveGameMutationVariables = Types.Exact<{
  ongoingGameId: Types.Scalars['ID']['input'];
}>;


export type LeaveGameMutation = { __typename?: 'Mutation', leaveOngoingGame: { __typename?: 'OngoingGame', _id: string, gameType: Types.GameType, processState: Types.OngoingGameProcessState, jsonState: string, currentTurn?: string | null, startedAt?: number | null, startsIn?: number | null, isPrivate: boolean, players: Array<{ __typename?: 'OngoingGamePlayer', score: number, userId: string, ready: boolean }> } };

export type SubscribeOngoingGameSubscriptionVariables = Types.Exact<{
  ongoingGameId: Types.Scalars['ID']['input'];
}>;


export type SubscribeOngoingGameSubscription = { __typename?: 'Subscription', ongoingGameStateChange: { __typename?: 'OngoingGameStateChange', _id?: string | null, gameType?: Types.GameType | null, processState?: Types.OngoingGameProcessState | null, jsonState?: string | null, currentTurn?: string | null, startsIn?: number | null, players?: Array<{ __typename?: 'OngoingGamePlayer', score: number, userId: string, ready: boolean }> | null } };

export const OngoingGameFragmentDoc = gql`
    fragment OngoingGame on OngoingGame {
  _id
  gameType
  processState
  jsonState
  players {
    score
    userId
    ready
  }
  currentTurn
  startedAt
  startsIn
  isPrivate
}
    `;
export const OngoingGameStateChangeFragmentDoc = gql`
    fragment OngoingGameStateChange on OngoingGameStateChange {
  _id
  gameType
  processState
  jsonState
  players {
    score
    userId
    ready
  }
  currentTurn
  startsIn
}
    `;
export const GetOngoingGameDocument = gql`
    query GetOngoingGame($ongoingGameId: ID!) {
  ongoingGame(ongoingGameId: $ongoingGameId) {
    ...OngoingGame
  }
}
    ${OngoingGameFragmentDoc}`;

/**
 * __useGetOngoingGameQuery__
 *
 * To run a query within a React component, call `useGetOngoingGameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOngoingGameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOngoingGameQuery({
 *   variables: {
 *      ongoingGameId: // value for 'ongoingGameId'
 *   },
 * });
 */
export function useGetOngoingGameQuery(baseOptions: Apollo.QueryHookOptions<GetOngoingGameQuery, GetOngoingGameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOngoingGameQuery, GetOngoingGameQueryVariables>(GetOngoingGameDocument, options);
      }
export function useGetOngoingGameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOngoingGameQuery, GetOngoingGameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOngoingGameQuery, GetOngoingGameQueryVariables>(GetOngoingGameDocument, options);
        }
export type GetOngoingGameQueryHookResult = ReturnType<typeof useGetOngoingGameQuery>;
export type GetOngoingGameLazyQueryHookResult = ReturnType<typeof useGetOngoingGameLazyQuery>;
export type GetOngoingGameQueryResult = Apollo.QueryResult<GetOngoingGameQuery, GetOngoingGameQueryVariables>;
export const JoinGameDocument = gql`
    mutation JoinGame($ongoingGameId: ID!) {
  joinOngoingGame(ongoingGameId: $ongoingGameId) {
    ...OngoingGame
  }
}
    ${OngoingGameFragmentDoc}`;
export type JoinGameMutationFn = Apollo.MutationFunction<JoinGameMutation, JoinGameMutationVariables>;

/**
 * __useJoinGameMutation__
 *
 * To run a mutation, you first call `useJoinGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinGameMutation, { data, loading, error }] = useJoinGameMutation({
 *   variables: {
 *      ongoingGameId: // value for 'ongoingGameId'
 *   },
 * });
 */
export function useJoinGameMutation(baseOptions?: Apollo.MutationHookOptions<JoinGameMutation, JoinGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinGameMutation, JoinGameMutationVariables>(JoinGameDocument, options);
      }
export type JoinGameMutationHookResult = ReturnType<typeof useJoinGameMutation>;
export type JoinGameMutationResult = Apollo.MutationResult<JoinGameMutation>;
export type JoinGameMutationOptions = Apollo.BaseMutationOptions<JoinGameMutation, JoinGameMutationVariables>;
export const PlayMoveDocument = gql`
    mutation PlayMove($ongoingGameId: ID!, $move: String!) {
  playTurn(ongoingGameId: $ongoingGameId, json: $move) {
    ...OngoingGame
  }
}
    ${OngoingGameFragmentDoc}`;
export type PlayMoveMutationFn = Apollo.MutationFunction<PlayMoveMutation, PlayMoveMutationVariables>;

/**
 * __usePlayMoveMutation__
 *
 * To run a mutation, you first call `usePlayMoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlayMoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playMoveMutation, { data, loading, error }] = usePlayMoveMutation({
 *   variables: {
 *      ongoingGameId: // value for 'ongoingGameId'
 *      move: // value for 'move'
 *   },
 * });
 */
export function usePlayMoveMutation(baseOptions?: Apollo.MutationHookOptions<PlayMoveMutation, PlayMoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PlayMoveMutation, PlayMoveMutationVariables>(PlayMoveDocument, options);
      }
export type PlayMoveMutationHookResult = ReturnType<typeof usePlayMoveMutation>;
export type PlayMoveMutationResult = Apollo.MutationResult<PlayMoveMutation>;
export type PlayMoveMutationOptions = Apollo.BaseMutationOptions<PlayMoveMutation, PlayMoveMutationVariables>;
export const ToggleReadyDocument = gql`
    mutation ToggleReady($ongoingGameId: ID!, $ready: Boolean!) {
  toggleReady(ongoingGameId: $ongoingGameId, ready: $ready) {
    ...OngoingGame
  }
}
    ${OngoingGameFragmentDoc}`;
export type ToggleReadyMutationFn = Apollo.MutationFunction<ToggleReadyMutation, ToggleReadyMutationVariables>;

/**
 * __useToggleReadyMutation__
 *
 * To run a mutation, you first call `useToggleReadyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleReadyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleReadyMutation, { data, loading, error }] = useToggleReadyMutation({
 *   variables: {
 *      ongoingGameId: // value for 'ongoingGameId'
 *      ready: // value for 'ready'
 *   },
 * });
 */
export function useToggleReadyMutation(baseOptions?: Apollo.MutationHookOptions<ToggleReadyMutation, ToggleReadyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleReadyMutation, ToggleReadyMutationVariables>(ToggleReadyDocument, options);
      }
export type ToggleReadyMutationHookResult = ReturnType<typeof useToggleReadyMutation>;
export type ToggleReadyMutationResult = Apollo.MutationResult<ToggleReadyMutation>;
export type ToggleReadyMutationOptions = Apollo.BaseMutationOptions<ToggleReadyMutation, ToggleReadyMutationVariables>;
export const LeaveGameDocument = gql`
    mutation LeaveGame($ongoingGameId: ID!) {
  leaveOngoingGame(ongoingGameId: $ongoingGameId) {
    ...OngoingGame
  }
}
    ${OngoingGameFragmentDoc}`;
export type LeaveGameMutationFn = Apollo.MutationFunction<LeaveGameMutation, LeaveGameMutationVariables>;

/**
 * __useLeaveGameMutation__
 *
 * To run a mutation, you first call `useLeaveGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveGameMutation, { data, loading, error }] = useLeaveGameMutation({
 *   variables: {
 *      ongoingGameId: // value for 'ongoingGameId'
 *   },
 * });
 */
export function useLeaveGameMutation(baseOptions?: Apollo.MutationHookOptions<LeaveGameMutation, LeaveGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LeaveGameMutation, LeaveGameMutationVariables>(LeaveGameDocument, options);
      }
export type LeaveGameMutationHookResult = ReturnType<typeof useLeaveGameMutation>;
export type LeaveGameMutationResult = Apollo.MutationResult<LeaveGameMutation>;
export type LeaveGameMutationOptions = Apollo.BaseMutationOptions<LeaveGameMutation, LeaveGameMutationVariables>;
export const SubscribeOngoingGameDocument = gql`
    subscription SubscribeOngoingGame($ongoingGameId: ID!) {
  ongoingGameStateChange(ongoingGameId: $ongoingGameId) {
    ...OngoingGameStateChange
  }
}
    ${OngoingGameStateChangeFragmentDoc}`;

/**
 * __useSubscribeOngoingGameSubscription__
 *
 * To run a query within a React component, call `useSubscribeOngoingGameSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeOngoingGameSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeOngoingGameSubscription({
 *   variables: {
 *      ongoingGameId: // value for 'ongoingGameId'
 *   },
 * });
 */
export function useSubscribeOngoingGameSubscription(baseOptions: Apollo.SubscriptionHookOptions<SubscribeOngoingGameSubscription, SubscribeOngoingGameSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeOngoingGameSubscription, SubscribeOngoingGameSubscriptionVariables>(SubscribeOngoingGameDocument, options);
      }
export type SubscribeOngoingGameSubscriptionHookResult = ReturnType<typeof useSubscribeOngoingGameSubscription>;
export type SubscribeOngoingGameSubscriptionResult = Apollo.SubscriptionResult<SubscribeOngoingGameSubscription>;