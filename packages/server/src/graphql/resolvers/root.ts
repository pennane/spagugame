import * as R from "ramda";
import { EAuthScope, TContext } from "../../infrastructure/context";
import {
  Game,
  GamePlayer,
  GameProcessState,
  GameType,
  Resolvers,
} from "../generated/graphql";
import { randomUUID } from "crypto";

/*
GAME.ID.STATE = GameProcessState 
GAME.ID.PROCESS_STATE = String (serialized json)
GAME.ID.GAME_TYPE = String (GameType)
GAME.ID.TEAMS = [String (team id)]
TEAM.ID.USERS = [String (userId)]
USER.ID.GAME.SCORE = Number

enum GameProcessState {
  NOT_STARTED
  STARTING
  ONGOING
  FINISHED
  CANCELLED
}
*/

type GqlSerializedGame = Omit<Game, "jsonState"> & {
  jsonState: string;
};
type SerializedGame = Omit<Game, "jsonState" | "players"> & {
  jsonState: string;
  players: string;
};
type DeserializedGame<T> = Omit<Game, "jsonState" | "players"> & {
  jsonState: T;
  players: GamePlayer[];
};

const gqlSerializeGame = <T>(game: DeserializedGame<T>): GqlSerializedGame =>
  R.evolve({ jsonState: (s) => JSON.stringify(s) }, game);

const serializeGame = <T>(game: DeserializedGame<T>): SerializedGame =>
  R.evolve(
    { jsonState: (s) => JSON.stringify(s), players: (p) => JSON.stringify(p) },
    game
  );

const deserializeGame = <T>(
  game: Record<string, string>
): DeserializedGame<T> =>
  R.evolve(
    { jsonState: (s) => JSON.parse(s), players: (p) => JSON.parse(p) },
    game
  ) as unknown as DeserializedGame<T>;

interface GameSettings<T> {
  maxPlayers: number;
  minPlayers: number;
  initialState: () => DeserializedGame<T>;
  nextState: (state: DeserializedGame<T>, move: string) => DeserializedGame<T>;
  canStart: (state: DeserializedGame<T>) => boolean;
  validateState: (data: unknown) => data is T;
}

type TickTackToeState = [
  [null | "o" | "x", null | "o" | "x", null | "o" | "x"],
  [null | "o" | "x", null | "o" | "x", null | "o" | "x"],
  [null | "o" | "x", null | "o" | "x", null | "o" | "x"]
];

const TickTackToeSettings: GameSettings<TickTackToeState> = {
  maxPlayers: 2,
  minPlayers: 2,
  validateState: (d): d is TickTackToeState => {
    if (!Array.isArray(d)) return false;
    if (!d[0] || !d[1] || !d[2]) return false;
    if (!Array.isArray(d[0]) || !Array.isArray(d[1]) || !Array.isArray(d[2]))
      return false;

    return d.every(
      (y) =>
        y.length === 3 &&
        y.every((v: unknown) => v === "o" || v === "x" || v === null)
    );
  },
  initialState: function () {
    return {
      _id: randomUUID(),
      gameType: GameType.TickTackToe,
      processState: GameProcessState.NotStarted,
      players: [],
      jsonState: Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => null)
      ) as TickTackToeState,
    };
  },
  canStart: function (s) {
    return (
      s.players.length >= this.minPlayers &&
      s.players.length <= this.maxPlayers &&
      s.processState === GameProcessState.NotStarted
    );
  },
  nextState: function (state, move) {
    if (state.processState !== GameProcessState.Ongoing)
      throw new Error("Invalid process state");
    if (!state.jsonState)
      throw new Error("MUST MAVE JSON STATE WHEN CHECKING NEXT STATE");
    const [x, y] = move.split("").map((s) => parseInt(s));
    if (state.jsonState?.[x]?.[y] !== null) {
      return state;
    }

    const currentPlayerIndex = state.players.findIndex(
      (p) => p.userId === state.currentTurn?.userId
    );

    state.jsonState[x][y] = currentPlayerIndex === 0 ? "x" : "o";

    const nextUp =
      state.players[currentPlayerIndex + (1 % state.players.length)];

    state.currentTurn = nextUp;

    return state;
  },
};

const createGame = async (
  ctx: TContext,
  { gameType, userId }: { gameType: GameType; userId: string }
) => {
  const settings = GAME_SETTINGS[gameType];

  const initialState = R.evolve(
    {
      players: R.concat([{ score: 0, userId }]),
      jsonState: (s) => JSON.stringify(s),
    },
    settings.initialState()
  );

  const serialized = serializeGame(initialState);

  await ctx.redis.hset(`game.${serialized._id}`, serialized);
  await ctx.redis.expire(`game.${serialized._id}`, 60);

  return initialState;
};

const GAME_SETTINGS = {
  [GameType.TickTackToe]: TickTackToeSettings,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} satisfies Record<GameType, GameSettings<any>>;

export const resolvers: Resolvers<TContext> = {
  Query: {
    game: async (_root, { gameId }, ctx) => {
      const data = await ctx.redis.hgetall(`game.${gameId}`);
      if (!data) throw new Error("Invalid game id");
      return data as unknown as Game;
    },
  },
  Subscription: {
    gameStateChanged: {
      subscribe: async (_root, { gameId }, ctx) => {
        return {
          [Symbol.asyncIterator]: () =>
            ctx.pubsub.asyncIterator(`game_changed.${gameId}`),
        };
      },
    },
  },
  Mutation: {
    createGame: async (_root, { gameType }, ctx) => {
      console.log(1);

      if (ctx.authScope === EAuthScope.UNAUTHENTICATED || !ctx?.user?._id)
        throw new Error("This resolver requires signing in");
      console.log(2);

      const game = await createGame(ctx, {
        userId: ctx.user._id.toString(),
        gameType,
      });

      console.log(3);

      return game;
    },
    joinGame: async (_root, { gameId }, ctx) => {
      if (ctx.authScope === EAuthScope.UNAUTHENTICATED || !ctx?.user?._id)
        throw new Error("This resolver requires signing in");

      const exists = await ctx.redis.exists(`game.${gameId}`);
      if (!exists) throw new Error("Game does not exist");

      const data = await ctx.redis.hgetall(`game.${gameId}`);

      const game = deserializeGame(data);

      if (game.processState !== GameProcessState.NotStarted) {
        throw new Error(
          "Cannot join a game that is already started or starting"
        );
      }

      const settings = GAME_SETTINGS[game.gameType];

      if (game.players.length + 1 > settings.maxPlayers) {
        throw new Error("Cannot join a game that is already full");
      }

      game.players.push({ userId: ctx.user._id.toString(), score: 0 });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const canStart = GAME_SETTINGS[game.gameType].canStart(game as any);

      if (canStart) {
        game.processState = GameProcessState.Ongoing;
      }

      const serialized = serializeGame(game);

      ctx.redis.hset(`game.${gameId}`, serialized);
      ctx.pubsub.publish(`game.${gameId}.updated`, game);

      return gqlSerializeGame(game);
    },
  },
};
