import * as Types from '../../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ProfilePageUserStatsFragment = { __typename?: 'UserStats', _id: string, userId: string, gameType: Types.GameType, totalWins: number, totalPlayed: number, elo: number };

export type ProfilePageUserAchievementFragment = { __typename?: 'Achievement', _id: string, name: string, description: string, criteria: { __typename?: 'LeaderboardRankUnlockCriteria', gameType?: Types.GameType | null, rank: number } | { __typename?: 'OtherUnlockCriteria', gameType?: Types.GameType | null } | { __typename?: 'TotalPlayedUnlockCriteria', gameType?: Types.GameType | null, played: number } | { __typename?: 'TotalWinsUnlockCriteria', gameType?: Types.GameType | null, wins: number } | { __typename?: 'WinStreakUnlockCriteria', gameType?: Types.GameType | null, streak: number } };

export type ProfilePageUserPlayedGameFragment = { __typename?: 'PlayedGame', _id: string, gameType: Types.GameType, playerIds: Array<string>, playerScores: Array<number>, playerElosBefore: Array<number>, playerElosAfter: Array<number>, startedAt: Date, finishedAt: Date, finalState?: string | null, ongoingGameId?: string | null };

export type UserFollowingFragment = { __typename?: 'User', followers: Array<{ __typename?: 'User', _id: string, userName: string, githubId: string }>, following: Array<{ __typename?: 'User', _id: string, userName: string, githubId: string }> };

export type ProfilePictureFragment = { __typename?: 'Image', id: string, hash?: string | null, url: string };

export type ProfilePageUserFragment = { __typename?: 'User', _id: string, githubId: string, userName: string, profilePicture?: { __typename?: 'Image', id: string, hash?: string | null, url: string } | null, stats: Array<{ __typename?: 'UserStats', _id: string, userId: string, gameType: Types.GameType, totalWins: number, totalPlayed: number, elo: number }>, playedGames: Array<{ __typename?: 'PlayedGame', _id: string, gameType: Types.GameType, playerIds: Array<string>, playerScores: Array<number>, playerElosBefore: Array<number>, playerElosAfter: Array<number>, startedAt: Date, finishedAt: Date, finalState?: string | null, ongoingGameId?: string | null }>, achievements: Array<{ __typename?: 'Achievement', _id: string, name: string, description: string, criteria: { __typename?: 'LeaderboardRankUnlockCriteria', gameType?: Types.GameType | null, rank: number } | { __typename?: 'OtherUnlockCriteria', gameType?: Types.GameType | null } | { __typename?: 'TotalPlayedUnlockCriteria', gameType?: Types.GameType | null, played: number } | { __typename?: 'TotalWinsUnlockCriteria', gameType?: Types.GameType | null, wins: number } | { __typename?: 'WinStreakUnlockCriteria', gameType?: Types.GameType | null, streak: number } }>, followers: Array<{ __typename?: 'User', _id: string, userName: string, githubId: string }>, following: Array<{ __typename?: 'User', _id: string, userName: string, githubId: string }> };

export type ProfilePageUserQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type ProfilePageUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', _id: string, githubId: string, userName: string, profilePicture?: { __typename?: 'Image', id: string, hash?: string | null, url: string } | null, stats: Array<{ __typename?: 'UserStats', _id: string, userId: string, gameType: Types.GameType, totalWins: number, totalPlayed: number, elo: number }>, playedGames: Array<{ __typename?: 'PlayedGame', _id: string, gameType: Types.GameType, playerIds: Array<string>, playerScores: Array<number>, playerElosBefore: Array<number>, playerElosAfter: Array<number>, startedAt: Date, finishedAt: Date, finalState?: string | null, ongoingGameId?: string | null }>, achievements: Array<{ __typename?: 'Achievement', _id: string, name: string, description: string, criteria: { __typename?: 'LeaderboardRankUnlockCriteria', gameType?: Types.GameType | null, rank: number } | { __typename?: 'OtherUnlockCriteria', gameType?: Types.GameType | null } | { __typename?: 'TotalPlayedUnlockCriteria', gameType?: Types.GameType | null, played: number } | { __typename?: 'TotalWinsUnlockCriteria', gameType?: Types.GameType | null, wins: number } | { __typename?: 'WinStreakUnlockCriteria', gameType?: Types.GameType | null, streak: number } }>, followers: Array<{ __typename?: 'User', _id: string, userName: string, githubId: string }>, following: Array<{ __typename?: 'User', _id: string, userName: string, githubId: string }> } | null };

export type FollowUserMutationVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
  toggle: Types.Scalars['Boolean']['input'];
}>;


export type FollowUserMutation = { __typename?: 'Mutation', toggleFollow: { __typename?: 'User', _id: string, followers: Array<{ __typename?: 'User', _id: string, userName: string, githubId: string }>, following: Array<{ __typename?: 'User', _id: string, userName: string, githubId: string }> } };

export type UploadProfileImageMutationVariables = Types.Exact<{
  file: Types.Scalars['Upload']['input'];
}>;


export type UploadProfileImageMutation = { __typename?: 'Mutation', uploadProfilePicture: { __typename?: 'User', _id: string, profilePicture?: { __typename?: 'Image', id: string, hash?: string | null, url: string } | null } };

export const ProfilePictureFragmentDoc = gql`
    fragment ProfilePicture on Image {
  id
  hash
  url
}
    `;
export const ProfilePageUserStatsFragmentDoc = gql`
    fragment ProfilePageUserStats on UserStats {
  _id
  userId
  gameType
  totalWins
  totalPlayed
  elo
}
    `;
export const ProfilePageUserPlayedGameFragmentDoc = gql`
    fragment ProfilePageUserPlayedGame on PlayedGame {
  _id
  gameType
  playerIds
  playerScores
  playerElosBefore
  playerElosAfter
  startedAt
  finishedAt
  finalState
  ongoingGameId
}
    `;
export const ProfilePageUserAchievementFragmentDoc = gql`
    fragment ProfilePageUserAchievement on Achievement {
  _id
  name
  description
  criteria {
    ... on OtherUnlockCriteria {
      gameType
    }
    ... on TotalWinsUnlockCriteria {
      gameType
      wins
    }
    ... on WinStreakUnlockCriteria {
      gameType
      streak
    }
    ... on TotalPlayedUnlockCriteria {
      gameType
      played
    }
    ... on LeaderboardRankUnlockCriteria {
      gameType
      rank
    }
  }
}
    `;
export const UserFollowingFragmentDoc = gql`
    fragment UserFollowing on User {
  followers {
    _id
    userName
    githubId
  }
  following {
    _id
    userName
    githubId
  }
}
    `;
export const ProfilePageUserFragmentDoc = gql`
    fragment ProfilePageUser on User {
  _id
  githubId
  userName
  profilePicture {
    ...ProfilePicture
  }
  stats {
    ...ProfilePageUserStats
  }
  playedGames {
    ...ProfilePageUserPlayedGame
  }
  achievements {
    ...ProfilePageUserAchievement
  }
  ...UserFollowing
}
    ${ProfilePictureFragmentDoc}
${ProfilePageUserStatsFragmentDoc}
${ProfilePageUserPlayedGameFragmentDoc}
${ProfilePageUserAchievementFragmentDoc}
${UserFollowingFragmentDoc}`;
export const ProfilePageUserDocument = gql`
    query ProfilePageUser($userId: ID!) {
  user(id: $userId) {
    ...ProfilePageUser
  }
}
    ${ProfilePageUserFragmentDoc}`;

/**
 * __useProfilePageUserQuery__
 *
 * To run a query within a React component, call `useProfilePageUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfilePageUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfilePageUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useProfilePageUserQuery(baseOptions: Apollo.QueryHookOptions<ProfilePageUserQuery, ProfilePageUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProfilePageUserQuery, ProfilePageUserQueryVariables>(ProfilePageUserDocument, options);
      }
export function useProfilePageUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfilePageUserQuery, ProfilePageUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProfilePageUserQuery, ProfilePageUserQueryVariables>(ProfilePageUserDocument, options);
        }
export type ProfilePageUserQueryHookResult = ReturnType<typeof useProfilePageUserQuery>;
export type ProfilePageUserLazyQueryHookResult = ReturnType<typeof useProfilePageUserLazyQuery>;
export type ProfilePageUserQueryResult = Apollo.QueryResult<ProfilePageUserQuery, ProfilePageUserQueryVariables>;
export const FollowUserDocument = gql`
    mutation FollowUser($userId: ID!, $toggle: Boolean!) {
  toggleFollow(userId: $userId, toggle: $toggle) {
    _id
    ...UserFollowing
  }
}
    ${UserFollowingFragmentDoc}`;
export type FollowUserMutationFn = Apollo.MutationFunction<FollowUserMutation, FollowUserMutationVariables>;

/**
 * __useFollowUserMutation__
 *
 * To run a mutation, you first call `useFollowUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followUserMutation, { data, loading, error }] = useFollowUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      toggle: // value for 'toggle'
 *   },
 * });
 */
export function useFollowUserMutation(baseOptions?: Apollo.MutationHookOptions<FollowUserMutation, FollowUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FollowUserMutation, FollowUserMutationVariables>(FollowUserDocument, options);
      }
export type FollowUserMutationHookResult = ReturnType<typeof useFollowUserMutation>;
export type FollowUserMutationResult = Apollo.MutationResult<FollowUserMutation>;
export type FollowUserMutationOptions = Apollo.BaseMutationOptions<FollowUserMutation, FollowUserMutationVariables>;
export const UploadProfileImageDocument = gql`
    mutation UploadProfileImage($file: Upload!) {
  uploadProfilePicture(file: $file) {
    _id
    profilePicture {
      ...ProfilePicture
    }
  }
}
    ${ProfilePictureFragmentDoc}`;
export type UploadProfileImageMutationFn = Apollo.MutationFunction<UploadProfileImageMutation, UploadProfileImageMutationVariables>;

/**
 * __useUploadProfileImageMutation__
 *
 * To run a mutation, you first call `useUploadProfileImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadProfileImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadProfileImageMutation, { data, loading, error }] = useUploadProfileImageMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadProfileImageMutation(baseOptions?: Apollo.MutationHookOptions<UploadProfileImageMutation, UploadProfileImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadProfileImageMutation, UploadProfileImageMutationVariables>(UploadProfileImageDocument, options);
      }
export type UploadProfileImageMutationHookResult = ReturnType<typeof useUploadProfileImageMutation>;
export type UploadProfileImageMutationResult = Apollo.MutationResult<UploadProfileImageMutation>;
export type UploadProfileImageMutationOptions = Apollo.BaseMutationOptions<UploadProfileImageMutation, UploadProfileImageMutationVariables>;