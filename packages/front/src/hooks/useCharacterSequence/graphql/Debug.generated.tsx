import * as Types from '../../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DebugMutationVariables = Types.Exact<{
  sequence: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type DebugMutation = { __typename?: 'Mutation', debug: boolean };


export const DebugDocument = gql`
    mutation Debug($sequence: [String!]!) {
  debug(tokens: $sequence)
}
    `;
export type DebugMutationFn = Apollo.MutationFunction<DebugMutation, DebugMutationVariables>;

/**
 * __useDebugMutation__
 *
 * To run a mutation, you first call `useDebugMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDebugMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [debugMutation, { data, loading, error }] = useDebugMutation({
 *   variables: {
 *      sequence: // value for 'sequence'
 *   },
 * });
 */
export function useDebugMutation(baseOptions?: Apollo.MutationHookOptions<DebugMutation, DebugMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DebugMutation, DebugMutationVariables>(DebugDocument, options);
      }
export type DebugMutationHookResult = ReturnType<typeof useDebugMutation>;
export type DebugMutationResult = Apollo.MutationResult<DebugMutation>;
export type DebugMutationOptions = Apollo.BaseMutationOptions<DebugMutation, DebugMutationVariables>;