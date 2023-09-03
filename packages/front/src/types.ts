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

export type Game = {
  __typename?: 'Game';
  _id: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  maxPlayers: Scalars['Int']['output'];
  minPlayers: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  ongoingGameIds: Array<Scalars['ID']['output']>;
  type: GameType;
};

export enum GameType {
  TickTackToe = 'TICK_TACK_TOE'
}

export type Mutation = {
  __typename?: 'Mutation';
  createOngoingGame: OngoingGame;
  joinOngoingGame: OngoingGame;
  playTurn: OngoingGame;
  updateUser: User;
};


export type MutationCreateOngoingGameArgs = {
  gameType: GameType;
};


export type MutationJoinOngoingGameArgs = {
  ongoingGameId: Scalars['ID']['input'];
};


export type MutationPlayTurnArgs = {
  json: Scalars['String']['input'];
  ongoingGameId: Scalars['ID']['input'];
};


export type MutationUpdateUserArgs = {
  userInput?: InputMaybe<UserInput>;
};

export type OngoingGame = {
  __typename?: 'OngoingGame';
  _id: Scalars['ID']['output'];
  currentTurn?: Maybe<Scalars['ID']['output']>;
  gameType: GameType;
  jsonState: Scalars['String']['output'];
  players: Array<OngoingGamePlayer>;
  processState: OngoingGameProcessState;
  startedAt?: Maybe<Scalars['Float']['output']>;
};

export type OngoingGamePlayer = {
  __typename?: 'OngoingGamePlayer';
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
  players?: Maybe<Array<OngoingGamePlayer>>;
  processState?: Maybe<OngoingGameProcessState>;
  startsIn?: Maybe<Scalars['Int']['output']>;
};

export type PlayedGame = {
  __typename?: 'PlayedGame';
  _id: Scalars['ID']['output'];
  finishedAt: Scalars['Date']['output'];
  gameType: GameType;
  playerElosAfter: Array<Scalars['Int']['output']>;
  playerElosBefore: Array<Scalars['Int']['output']>;
  playerIds: Array<Scalars['ID']['output']>;
  playerScores: Array<Scalars['Int']['output']>;
  startedAt: Scalars['Date']['output'];
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  game?: Maybe<Game>;
  games: Array<Game>;
  ongoingGame: OngoingGame;
  user?: Maybe<User>;
  userStats?: Maybe<UserStats>;
  users: Array<User>;
  usersStats: Array<UserStats>;
};


export type QueryGameArgs = {
  gameType?: InputMaybe<GameType>;
};


export type QueryOngoingGameArgs = {
  ongoingGameId: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserStatsArgs = {
  gameType: GameType;
  userId: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryUsersStatsArgs = {
  gameType: GameType;
  userIds: Array<Scalars['ID']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  ongoingGameStateChange: OngoingGameStateChange;
  testCounter: Scalars['Int']['output'];
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
  roles: Array<UserRole>;
  userName: Scalars['String']['output'];
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
  elo: Scalars['Int']['output'];
  gameType: GameType;
  totalWins: Scalars['Int']['output'];
  userId: Scalars['ID']['output'];
};
