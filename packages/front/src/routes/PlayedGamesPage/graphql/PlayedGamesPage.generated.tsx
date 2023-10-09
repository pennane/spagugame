import * as Types from '../../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PlayedGamePlayerFragment = { __typename?: 'User', _id: string, githubId: string, userName: string };

export type PlayedGamesQueryVariables = Types.Exact<{
  gameType: Types.GameType;
}>;


export type PlayedGamesQuery = { __typename?: 'Query', playedGames: Array<{ __typename?: 'PlayedGame', _id: string, gameType: Types.GameType, playerElosBefore: Array<number>, startedAt: Date, finishedAt: Date, players: Array<{ __typename?: 'User', _id: string, githubId: string, userName: string }> }> };

export const PlayedGamePlayerFragmentDoc = gql`
    fragment PlayedGamePlayer on User {
  _id
  githubId
  userName
}
    `;
export const PlayedGamesDocument = gql`
    query PlayedGames($gameType: GameType!) {
  playedGames(gameTypes: [$gameType], first: 10) {
    _id
    gameType
    playerElosBefore
    startedAt
    finishedAt
    players {
      ...PlayedGamePlayer
    }
  }
}
    ${PlayedGamePlayerFragmentDoc}`;

/**
 * __usePlayedGamesQuery__
 *
 * To run a query within a React component, call `usePlayedGamesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlayedGamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayedGamesQuery({
 *   variables: {
 *      gameType: // value for 'gameType'
 *   },
 * });
 */
export function usePlayedGamesQuery(baseOptions: Apollo.QueryHookOptions<PlayedGamesQuery, PlayedGamesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlayedGamesQuery, PlayedGamesQueryVariables>(PlayedGamesDocument, options);
      }
export function usePlayedGamesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlayedGamesQuery, PlayedGamesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlayedGamesQuery, PlayedGamesQueryVariables>(PlayedGamesDocument, options);
        }
export type PlayedGamesQueryHookResult = ReturnType<typeof usePlayedGamesQuery>;
export type PlayedGamesLazyQueryHookResult = ReturnType<typeof usePlayedGamesLazyQuery>;
export type PlayedGamesQueryResult = Apollo.QueryResult<PlayedGamesQuery, PlayedGamesQueryVariables>;