/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CacheControlScope: CacheControlScope;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Game: ResolverTypeWrapper<Game>;
  GameType: GameType;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Leaderboard: ResolverTypeWrapper<Leaderboard>;
  LeaderboardPlayer: ResolverTypeWrapper<LeaderboardPlayer>;
  Mutation: ResolverTypeWrapper<{}>;
  OngoingGame: ResolverTypeWrapper<OngoingGame>;
  OngoingGamePlayer: ResolverTypeWrapper<OngoingGamePlayer>;
  OngoingGameProcessState: OngoingGameProcessState;
  OngoingGameStateChange: ResolverTypeWrapper<OngoingGameStateChange>;
  PlayedGame: ResolverTypeWrapper<PlayedGame>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  UserInput: UserInput;
  UserRole: UserRole;
  UserStats: ResolverTypeWrapper<UserStats>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Date: Scalars['Date']['output'];
  Float: Scalars['Float']['output'];
  Game: Game;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Leaderboard: Leaderboard;
  LeaderboardPlayer: LeaderboardPlayer;
  Mutation: {};
  OngoingGame: OngoingGame;
  OngoingGamePlayer: OngoingGamePlayer;
  OngoingGameStateChange: OngoingGameStateChange;
  PlayedGame: PlayedGame;
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
  User: User;
  UserInput: UserInput;
  UserStats: UserStats;
};

export type CacheControlDirectiveArgs = {
  inheritMaxAge?: Maybe<Scalars['Boolean']['input']>;
  maxAge?: Maybe<Scalars['Int']['input']>;
  scope?: Maybe<CacheControlScope>;
};

export type CacheControlDirectiveResolver<Result, Parent, ContextType = any, Args = CacheControlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type GameResolvers<ContextType = any, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  maxPlayers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  minPlayers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ongoingGames?: Resolver<Array<ResolversTypes['OngoingGame']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['GameType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeaderboardResolvers<ContextType = any, ParentType extends ResolversParentTypes['Leaderboard'] = ResolversParentTypes['Leaderboard']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  gameType?: Resolver<ResolversTypes['GameType'], ParentType, ContextType>;
  players?: Resolver<Array<ResolversTypes['LeaderboardPlayer']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeaderboardPlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeaderboardPlayer'] = ResolversParentTypes['LeaderboardPlayer']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  elo?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  githubId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  totalPlayed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalWins?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createOngoingGame?: Resolver<ResolversTypes['OngoingGame'], ParentType, ContextType, RequireFields<MutationCreateOngoingGameArgs, 'gameType'>>;
  joinOngoingGame?: Resolver<ResolversTypes['OngoingGame'], ParentType, ContextType, RequireFields<MutationJoinOngoingGameArgs, 'ongoingGameId'>>;
  leaveOngoingGame?: Resolver<ResolversTypes['OngoingGame'], ParentType, ContextType, RequireFields<MutationLeaveOngoingGameArgs, 'ongoingGameId'>>;
  playTurn?: Resolver<ResolversTypes['OngoingGame'], ParentType, ContextType, RequireFields<MutationPlayTurnArgs, 'json' | 'ongoingGameId'>>;
  toggleReady?: Resolver<ResolversTypes['OngoingGame'], ParentType, ContextType, RequireFields<MutationToggleReadyArgs, 'ongoingGameId' | 'ready'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, Partial<MutationUpdateUserArgs>>;
};

export type OngoingGameResolvers<ContextType = any, ParentType extends ResolversParentTypes['OngoingGame'] = ResolversParentTypes['OngoingGame']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  currentTurn?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  gameType?: Resolver<ResolversTypes['GameType'], ParentType, ContextType>;
  isPrivate?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  jsonState?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  playedGameId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  players?: Resolver<Array<ResolversTypes['OngoingGamePlayer']>, ParentType, ContextType>;
  processState?: Resolver<ResolversTypes['OngoingGameProcessState'], ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  startsIn?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  winnerIds?: Resolver<Maybe<Array<ResolversTypes['ID']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OngoingGamePlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['OngoingGamePlayer'] = ResolversParentTypes['OngoingGamePlayer']> = {
  ready?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OngoingGameStateChangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['OngoingGameStateChange'] = ResolversParentTypes['OngoingGameStateChange']> = {
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  currentTurn?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  gameType?: Resolver<Maybe<ResolversTypes['GameType']>, ParentType, ContextType>;
  jsonState?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  playedGameId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  players?: Resolver<Maybe<Array<ResolversTypes['OngoingGamePlayer']>>, ParentType, ContextType>;
  processState?: Resolver<Maybe<ResolversTypes['OngoingGameProcessState']>, ParentType, ContextType>;
  startsIn?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  winnerIds?: Resolver<Maybe<Array<ResolversTypes['ID']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayedGameResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlayedGame'] = ResolversParentTypes['PlayedGame']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  finalState?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  finishedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  gameType?: Resolver<ResolversTypes['GameType'], ParentType, ContextType>;
  ongoingGameId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  playerElosAfter?: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
  playerElosBefore?: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
  playerIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  playerScores?: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType>;
  startedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  game?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType, Partial<QueryGameArgs>>;
  games?: Resolver<Array<ResolversTypes['Game']>, ParentType, ContextType>;
  leaderboards?: Resolver<Array<ResolversTypes['Leaderboard']>, ParentType, ContextType, RequireFields<QueryLeaderboardsArgs, 'gameTypes'>>;
  ongoingGame?: Resolver<ResolversTypes['OngoingGame'], ParentType, ContextType, RequireFields<QueryOngoingGameArgs, 'ongoingGameId'>>;
  playedGame?: Resolver<Maybe<ResolversTypes['PlayedGame']>, ParentType, ContextType, Partial<QueryPlayedGameArgs>>;
  playedGames?: Resolver<Array<ResolversTypes['PlayedGame']>, ParentType, ContextType, Partial<QueryPlayedGamesArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUsersArgs>>;
  usersStats?: Resolver<Array<ResolversTypes['UserStats']>, ParentType, ContextType, RequireFields<QueryUsersStatsArgs, 'gameType' | 'userIds'>>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  newOngoingGame?: SubscriptionResolver<ResolversTypes['OngoingGame'], "newOngoingGame", ParentType, ContextType, Partial<SubscriptionNewOngoingGameArgs>>;
  ongoingGameStateChange?: SubscriptionResolver<ResolversTypes['OngoingGameStateChange'], "ongoingGameStateChange", ParentType, ContextType, RequireFields<SubscriptionOngoingGameStateChangeArgs, 'ongoingGameId'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  githubId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  joinedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  playedGames?: Resolver<Array<ResolversTypes['PlayedGame']>, ParentType, ContextType, Partial<UserPlayedGamesArgs>>;
  roles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>;
  stats?: Resolver<Array<ResolversTypes['UserStats']>, ParentType, ContextType, Partial<UserStatsArgs>>;
  userName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserStats'] = ResolversParentTypes['UserStats']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  elo?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  gameType?: Resolver<ResolversTypes['GameType'], ParentType, ContextType>;
  totalPlayed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalWins?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  Game?: GameResolvers<ContextType>;
  Leaderboard?: LeaderboardResolvers<ContextType>;
  LeaderboardPlayer?: LeaderboardPlayerResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  OngoingGame?: OngoingGameResolvers<ContextType>;
  OngoingGamePlayer?: OngoingGamePlayerResolvers<ContextType>;
  OngoingGameStateChange?: OngoingGameStateChangeResolvers<ContextType>;
  PlayedGame?: PlayedGameResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserStats?: UserStatsResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
};
