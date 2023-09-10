import * as Types from '../../../types';

import { gql } from '@apollo/client';
import { GameFragmentDoc } from '../../LandingPage/graphql/Games.generated';
import { OngoingGameFragmentDoc } from '../../../games/graphql/OngoingGame.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GameQueryVariables = Types.Exact<{
  gameType: Types.GameType;
}>;


export type GameQuery = { __typename?: 'Query', game?: { __typename?: 'Game', _id: string, type: Types.GameType, name: string, description: string, maxPlayers: number, minPlayers: number, ongoingGames: Array<{ __typename?: 'OngoingGame', _id: string, gameType: Types.GameType, isPrivate: boolean, processState: Types.OngoingGameProcessState, players: Array<{ __typename?: 'OngoingGamePlayer', userId: string }> }> } | null };

export type NewGameMutationVariables = Types.Exact<{
  gameType: Types.GameType;
  private: Types.Scalars['Boolean']['input'];
}>;


export type NewGameMutation = { __typename?: 'Mutation', createOngoingGame: { __typename?: 'OngoingGame', _id: string, gameType: Types.GameType, processState: Types.OngoingGameProcessState, jsonState: string, currentTurn?: string | null, startedAt?: number | null, startsIn?: number | null, isPrivate: boolean, playedGameId?: string | null, winnerIds?: Array<string> | null, players: Array<{ __typename?: 'OngoingGamePlayer', score: number, userId: string, ready: boolean }> } };


export const GameDocument = gql`
    query Game($gameType: GameType!) {
  game(gameType: $gameType) {
    ...Game
  }
}
    ${GameFragmentDoc}`;

/**
 * __useGameQuery__
 *
 * To run a query within a React component, call `useGameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameQuery({
 *   variables: {
 *      gameType: // value for 'gameType'
 *   },
 * });
 */
export function useGameQuery(baseOptions: Apollo.QueryHookOptions<GameQuery, GameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GameQuery, GameQueryVariables>(GameDocument, options);
      }
export function useGameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GameQuery, GameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GameQuery, GameQueryVariables>(GameDocument, options);
        }
export type GameQueryHookResult = ReturnType<typeof useGameQuery>;
export type GameLazyQueryHookResult = ReturnType<typeof useGameLazyQuery>;
export type GameQueryResult = Apollo.QueryResult<GameQuery, GameQueryVariables>;
export const NewGameDocument = gql`
    mutation NewGame($gameType: GameType!, $private: Boolean!) {
  createOngoingGame(gameType: $gameType, isPrivate: $private) {
    ...OngoingGame
  }
}
    ${OngoingGameFragmentDoc}`;
export type NewGameMutationFn = Apollo.MutationFunction<NewGameMutation, NewGameMutationVariables>;

/**
 * __useNewGameMutation__
 *
 * To run a mutation, you first call `useNewGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNewGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [newGameMutation, { data, loading, error }] = useNewGameMutation({
 *   variables: {
 *      gameType: // value for 'gameType'
 *      private: // value for 'private'
 *   },
 * });
 */
export function useNewGameMutation(baseOptions?: Apollo.MutationHookOptions<NewGameMutation, NewGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<NewGameMutation, NewGameMutationVariables>(NewGameDocument, options);
      }
export type NewGameMutationHookResult = ReturnType<typeof useNewGameMutation>;
export type NewGameMutationResult = Apollo.MutationResult<NewGameMutation>;
export type NewGameMutationOptions = Apollo.BaseMutationOptions<NewGameMutation, NewGameMutationVariables>;