/* eslint-disable */
import { GraphQLResolveInfo } from "graphql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Game = {
  __typename?: "Game";
  _id: Scalars["ID"]["output"];
  currentTurn?: Maybe<Scalars["ID"]["output"]>;
  gameType: GameType;
  jsonState: Scalars["String"]["output"];
  players: Array<GamePlayer>;
  processState: GameProcessState;
};

export type GamePlayer = {
  __typename?: "GamePlayer";
  score: Scalars["Int"]["output"];
  userId: Scalars["ID"]["output"];
};

export enum GameProcessState {
  Cancelled = "CANCELLED",
  Finished = "FINISHED",
  NotStarted = "NOT_STARTED",
  Ongoing = "ONGOING",
  Starting = "STARTING",
}

export type GameStateChange = {
  __typename?: "GameStateChange";
  _id?: Maybe<Scalars["ID"]["output"]>;
  currentTurn?: Maybe<Scalars["ID"]["output"]>;
  gameType?: Maybe<GameType>;
  jsonState?: Maybe<Scalars["String"]["output"]>;
  players?: Maybe<Array<GamePlayer>>;
  processState?: Maybe<GameProcessState>;
  startsIn?: Maybe<Scalars["Int"]["output"]>;
};

export enum GameType {
  TickTackToe = "TICK_TACK_TOE",
}

export type Mutation = {
  __typename?: "Mutation";
  createGame: Game;
  joinGame: Game;
};

export type MutationCreateGameArgs = {
  gameType: GameType;
};

export type MutationJoinGameArgs = {
  gameId: Scalars["ID"]["input"];
};

export type Query = {
  __typename?: "Query";
  game: Game;
  userActiveGames: Array<Game>;
};

export type QueryGameArgs = {
  gameId: Scalars["ID"]["input"];
};

export type QueryUserActiveGamesArgs = {
  userId: Scalars["ID"]["input"];
};

export type Subscription = {
  __typename?: "Subscription";
  gameStateChange: GameStateChange;
};

export type SubscriptiongameStateChangeArgs = {
  gameId: Scalars["ID"]["input"];
};

export type User = {
  __typename?: "User";
  _id: Scalars["ID"]["output"];
  roles: Array<UserRole>;
};

export enum UserRole {
  Admin = "ADMIN",
  User = "USER",
}

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  Game: ResolverTypeWrapper<Game>;
  GamePlayer: ResolverTypeWrapper<GamePlayer>;
  GameProcessState: GameProcessState;
  GameStateChange: ResolverTypeWrapper<GameStateChange>;
  GameType: GameType;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  UserRole: UserRole;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars["Boolean"]["output"];
  Game: Game;
  GamePlayer: GamePlayer;
  GameStateChange: GameStateChange;
  ID: Scalars["ID"]["output"];
  Int: Scalars["Int"]["output"];
  Mutation: {};
  Query: {};
  String: Scalars["String"]["output"];
  Subscription: {};
  User: User;
};

export type GameResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Game"] = ResolversParentTypes["Game"]
> = {
  _id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  currentTurn?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  gameType?: Resolver<ResolversTypes["GameType"], ParentType, ContextType>;
  jsonState?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  players?: Resolver<
    Array<ResolversTypes["GamePlayer"]>,
    ParentType,
    ContextType
  >;
  processState?: Resolver<
    ResolversTypes["GameProcessState"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GamePlayerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["GamePlayer"] = ResolversParentTypes["GamePlayer"]
> = {
  score?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameStateChangeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["GameStateChange"] = ResolversParentTypes["GameStateChange"]
> = {
  _id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  currentTurn?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  gameType?: Resolver<
    Maybe<ResolversTypes["GameType"]>,
    ParentType,
    ContextType
  >;
  jsonState?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  players?: Resolver<
    Maybe<Array<ResolversTypes["GamePlayer"]>>,
    ParentType,
    ContextType
  >;
  processState?: Resolver<
    Maybe<ResolversTypes["GameProcessState"]>,
    ParentType,
    ContextType
  >;
  startsIn?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  createGame?: Resolver<
    ResolversTypes["Game"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateGameArgs, "gameType">
  >;
  joinGame?: Resolver<
    ResolversTypes["Game"],
    ParentType,
    ContextType,
    RequireFields<MutationJoinGameArgs, "gameId">
  >;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  game?: Resolver<
    ResolversTypes["Game"],
    ParentType,
    ContextType,
    RequireFields<QueryGameArgs, "gameId">
  >;
  userActiveGames?: Resolver<
    Array<ResolversTypes["Game"]>,
    ParentType,
    ContextType,
    RequireFields<QueryUserActiveGamesArgs, "userId">
  >;
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"]
> = {
  gameStateChange?: SubscriptionResolver<
    ResolversTypes["GameStateChange"],
    "gameStateChange",
    ParentType,
    ContextType,
    RequireFields<SubscriptiongameStateChangeArgs, "gameId">
  >;
};

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = {
  _id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes["UserRole"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Game?: GameResolvers<ContextType>;
  GamePlayer?: GamePlayerResolvers<ContextType>;
  GameStateChange?: GameStateChangeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};
