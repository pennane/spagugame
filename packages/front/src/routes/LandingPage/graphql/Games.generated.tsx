import * as Types from '../../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GamesViewOngoingGameFragment = { __typename?: 'OngoingGame', _id: string, gameType: Types.GameType, isPrivate: boolean, processState: Types.OngoingGameProcessState, players: Array<{ __typename?: 'OngoingGamePlayer', userId: string }> };

export type GameFragment = { __typename?: 'Game', _id: string, type: Types.GameType, name: string, description: string, maxPlayers: number, minPlayers: number, ongoingGames: Array<{ __typename?: 'OngoingGame', _id: string, gameType: Types.GameType, isPrivate: boolean, processState: Types.OngoingGameProcessState, players: Array<{ __typename?: 'OngoingGamePlayer', userId: string }> }> };

export type GamesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GamesQuery = { __typename?: 'Query', games: Array<{ __typename?: 'Game', _id: string, type: Types.GameType, name: string, description: string, maxPlayers: number, minPlayers: number, ongoingGames: Array<{ __typename?: 'OngoingGame', _id: string, gameType: Types.GameType, isPrivate: boolean, processState: Types.OngoingGameProcessState, players: Array<{ __typename?: 'OngoingGamePlayer', userId: string }> }> }> };

export const GamesViewOngoingGameFragmentDoc = gql`
    fragment GamesViewOngoingGame on OngoingGame {
  _id
  gameType
  players {
    userId
  }
  isPrivate
  processState
}
    `;
export const GameFragmentDoc = gql`
    fragment Game on Game {
  _id
  type
  name
  description
  ongoingGames {
    ...GamesViewOngoingGame
  }
  maxPlayers
  minPlayers
}
    ${GamesViewOngoingGameFragmentDoc}`;
export const GamesDocument = gql`
    query Games {
  games {
    ...Game
  }
}
    ${GameFragmentDoc}`;

/**
 * __useGamesQuery__
 *
 * To run a query within a React component, call `useGamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGamesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGamesQuery(baseOptions?: Apollo.QueryHookOptions<GamesQuery, GamesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GamesQuery, GamesQueryVariables>(GamesDocument, options);
      }
export function useGamesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GamesQuery, GamesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GamesQuery, GamesQueryVariables>(GamesDocument, options);
        }
export type GamesQueryHookResult = ReturnType<typeof useGamesQuery>;
export type GamesLazyQueryHookResult = ReturnType<typeof useGamesLazyQuery>;
export type GamesQueryResult = Apollo.QueryResult<GamesQuery, GamesQueryVariables>;