import * as R from "ramda";
import { IUser } from "../../collections/User/User";
import { TContext, getContext } from "../context";
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { ObjectId } from "mongodb";

export const createMockUser = (user: Partial<IUser>): IUser => {
  return R.mergeDeepRight(
    {
      _id: new ObjectId(),
      githubId: "123",
      joinedAt: new Date(),
      userName: "test user",
      achievementIds: [],
      followerIds: [],
      followingIds: [],
      leaderboardRanks: [],
      playedGames: [],
      roles: [],
      stats: [],
    },
    user
  );
};

type TCreateMockContext = {
  (a: { userOverrides?: Partial<IUser>; authenticated: false }): Promise<{
    ctx: TContext;
    user: undefined;
  }>;
  (a: { userOverrides?: Partial<IUser>; authenticated: true }): Promise<{
    ctx: TContext;
    user: IUser;
  }>;
};

export const createMockContext = (async ({
  userOverrides,
  authenticated,
}: {
  userOverrides?: Partial<IUser>;
  authenticated: boolean;
}) => {
  const mockUser = createMockUser(userOverrides || {});

  const context = await getContext({
    req: { user: authenticated ? mockUser : undefined },
  } as unknown as ExpressContextFunctionArgument);

  if (!authenticated) {
    return { ctx: context };
  }

  const existingUser =
    userOverrides &&
    (await context.collections.user.findOne({
      _id: userOverrides._id,
    }));

  if (existingUser) {
    return { ctx: context, user: existingUser };
  }
  await context.collections.user.insertOne(mockUser, {
    bypassDocumentValidation: true,
  });

  return { ctx: context, user: mockUser };
}) as TCreateMockContext;
