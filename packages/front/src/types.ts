export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: Date; output: Date; }
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Game = {
  __typename?: 'Game';
  _id: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  maxPlayers: Scalars['Int']['output'];
  minPlayers: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  ongoingGames: Array<OngoingGame>;
  type: GameType;
};

export enum GameType {
  FindFour = 'FIND_FOUR',
  TickTackToe = 'TICK_TACK_TOE'
}

export type Leaderboard = {
  __typename?: 'Leaderboard';
  _id: Scalars['ID']['output'];
  gameType: GameType;
  players: Array<LeaderboardPlayer>;
  updatedAt: Scalars['Date']['output'];
};

export type LeaderboardPlayer = {
  __typename?: 'LeaderboardPlayer';
  _id: Scalars['ID']['output'];
  elo: Scalars['Float']['output'];
  githubId?: Maybe<Scalars['ID']['output']>;
  totalPlayed: Scalars['Int']['output'];
  totalWins: Scalars['Int']['output'];
  userName?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createOngoingGame: OngoingGame;
  joinOngoingGame: OngoingGame;
  leaveOngoingGame: OngoingGame;
  playTurn: OngoingGame;
  toggleReady: OngoingGame;
  updateUser: User;
};


export type MutationCreateOngoingGameArgs = {
  gameType: GameType;
  isPrivate?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationJoinOngoingGameArgs = {
  ongoingGameId: Scalars['ID']['input'];
};


export type MutationLeaveOngoingGameArgs = {
  ongoingGameId: Scalars['ID']['input'];
};


export type MutationPlayTurnArgs = {
  json: Scalars['String']['input'];
  ongoingGameId: Scalars['ID']['input'];
};


export type MutationToggleReadyArgs = {
  ongoingGameId: Scalars['ID']['input'];
  ready: Scalars['Boolean']['input'];
};


export type MutationUpdateUserArgs = {
  userInput?: InputMaybe<UserInput>;
};

export type OngoingGame = {
  __typename?: 'OngoingGame';
  _id: Scalars['ID']['output'];
  currentTurn?: Maybe<Scalars['ID']['output']>;
  gameType: GameType;
  isPrivate: Scalars['Boolean']['output'];
  jsonState: Scalars['String']['output'];
  playedGameId?: Maybe<Scalars['ID']['output']>;
  players: Array<OngoingGamePlayer>;
  processState: OngoingGameProcessState;
  startedAt?: Maybe<Scalars['Float']['output']>;
  startsIn?: Maybe<Scalars['Int']['output']>;
  winnerIds?: Maybe<Array<Scalars['ID']['output']>>;
};

export type OngoingGamePlayer = {
  __typename?: 'OngoingGamePlayer';
  ready: Scalars['Boolean']['output'];
  score: Scalars['Int']['output'];
  userId: Scalars['ID']['output'];
};

export enum OngoingGameProcessState {
  Cancelled = 'CANCELLED',
  Finished = 'FINISHED',
  NotStarted = 'NOT_STARTED',
  Ongoing = 'ONGOING',
  Starting = 'STARTING'
}

export type OngoingGameStateChange = {
  __typename?: 'OngoingGameStateChange';
  _id?: Maybe<Scalars['ID']['output']>;
  currentTurn?: Maybe<Scalars['ID']['output']>;
  gameType?: Maybe<GameType>;
  jsonState?: Maybe<Scalars['String']['output']>;
  playedGameId?: Maybe<Scalars['ID']['output']>;
  players?: Maybe<Array<OngoingGamePlayer>>;
  processState?: Maybe<OngoingGameProcessState>;
  startsIn?: Maybe<Scalars['Int']['output']>;
  winnerIds?: Maybe<Array<Scalars['ID']['output']>>;
};

export type PlayedGame = {
  __typename?: 'PlayedGame';
  _id: Scalars['ID']['output'];
  finalState?: Maybe<Scalars['String']['output']>;
  finishedAt: Scalars['Date']['output'];
  gameType: GameType;
  ongoingGameId?: Maybe<Scalars['ID']['output']>;
  playerElosAfter: Array<Scalars['Float']['output']>;
  playerElosBefore: Array<Scalars['Float']['output']>;
  playerIds: Array<Scalars['ID']['output']>;
  playerScores: Array<Scalars['Int']['output']>;
  startedAt: Scalars['Date']['output'];
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  game?: Maybe<Game>;
  games: Array<Game>;
  leaderboards: Array<Leaderboard>;
  ongoingGame: OngoingGame;
  playedGame?: Maybe<PlayedGame>;
  playedGames: Array<PlayedGame>;
  user?: Maybe<User>;
  users: Array<User>;
  usersStats: Array<UserStats>;
};


export type QueryGameArgs = {
  gameType?: InputMaybe<GameType>;
};


export type QueryLeaderboardsArgs = {
  gameTypes: Array<GameType>;
};


export type QueryOngoingGameArgs = {
  ongoingGameId: Scalars['ID']['input'];
};


export type QueryPlayedGameArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  ongoingGameId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryPlayedGamesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  gameTypes?: InputMaybe<Array<GameType>>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  nameIncludes?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUsersStatsArgs = {
  gameType: GameType;
  userIds: Array<Scalars['ID']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  newOngoingGame: OngoingGame;
  ongoingGameStateChange: OngoingGameStateChange;
};


export type SubscriptionNewOngoingGameArgs = {
  gameType?: InputMaybe<GameType>;
};


export type SubscriptionOngoingGameStateChangeArgs = {
  ongoingGameId: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  githubId: Scalars['ID']['output'];
  joinedAt: Scalars['Date']['output'];
  playedGames: Array<PlayedGame>;
  roles: Array<UserRole>;
  stats: Array<UserStats>;
  userName: Scalars['String']['output'];
};


export type UserPlayedGamesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  gameTypes?: InputMaybe<Array<GameType>>;
};


export type UserStatsArgs = {
  gameTypes?: InputMaybe<Array<GameType>>;
};

export type UserInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export type UserStats = {
  __typename?: 'UserStats';
  _id: Scalars['ID']['output'];
  elo: Scalars['Float']['output'];
  gameType: GameType;
  totalPlayed: Scalars['Int']['output'];
  totalWins: Scalars['Int']['output'];
  userId: Scalars['ID']['output'];
};
