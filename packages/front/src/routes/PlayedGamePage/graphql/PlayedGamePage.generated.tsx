import * as Types from '../../../types';

import { gql } from '@apollo/client';
import { ProfilePageUserPlayedGameFragmentDoc } from '../../ProfilePage/graphql/ProfilePage.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PlayedGamePagePlayedGameQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type PlayedGamePagePlayedGameQuery = { __typename?: 'Query', playedGame?: { __typename?: 'PlayedGame', _id: string, gameType: Types.GameType, playerIds: Array<string>, playerScores: Array<number>, playerElosBefore: Array<number>, playerElosAfter: Array<number>, startedAt: Date, finishedAt: Date } | null };


export const PlayedGamePagePlayedGameDocument = gql`
    query PlayedGamePagePlayedGame($id: ID!) {
  playedGame(id: $id) {
    ...ProfilePageUserPlayedGame
  }
}
    ${ProfilePageUserPlayedGameFragmentDoc}`;

/**
 * __usePlayedGamePagePlayedGameQuery__
 *
 * To run a query within a React component, call `usePlayedGamePagePlayedGameQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlayedGamePagePlayedGameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayedGamePagePlayedGameQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePlayedGamePagePlayedGameQuery(baseOptions: Apollo.QueryHookOptions<PlayedGamePagePlayedGameQuery, PlayedGamePagePlayedGameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlayedGamePagePlayedGameQuery, PlayedGamePagePlayedGameQueryVariables>(PlayedGamePagePlayedGameDocument, options);
      }
export function usePlayedGamePagePlayedGameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlayedGamePagePlayedGameQuery, PlayedGamePagePlayedGameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlayedGamePagePlayedGameQuery, PlayedGamePagePlayedGameQueryVariables>(PlayedGamePagePlayedGameDocument, options);
        }
export type PlayedGamePagePlayedGameQueryHookResult = ReturnType<typeof usePlayedGamePagePlayedGameQuery>;
export type PlayedGamePagePlayedGameLazyQueryHookResult = ReturnType<typeof usePlayedGamePagePlayedGameLazyQuery>;
export type PlayedGamePagePlayedGameQueryResult = Apollo.QueryResult<PlayedGamePagePlayedGameQuery, PlayedGamePagePlayedGameQueryVariables>;