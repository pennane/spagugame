import { expect } from "chai";

import giveEntitledGameAchievements from "../giveEntitledGameAchievements";
import { createMockContext } from "../../../infrastructure/testing/mock";
import { testACL } from "../../../infrastructure/testing/acl";
import { clearDatabase } from "../../../infrastructure/testing/db";
import { GameType } from "../../../graphql/generated/graphql";

describe("achievements.giveEntitledGameAchievements.test", async () => {
  beforeEach(async () => await clearDatabase());
  after(clearDatabase);
  before(() =>
    testACL({
      authenticatedService: true,
      service: giveEntitledGameAchievements,
    })
  );

  it("should work kinda", async () => {
    const { ctx, user } = await createMockContext({
      authenticated: true,
      userOverrides: {},
    });
    await ctx.collections.userStats.insertOne({
      userId: user._id.toString(),
      gameType: GameType.ColorFlood,
      totalPlayed: 2,
      elo: 0,
      totalWins: 0,
    } as any);
    const { achievements } = await giveEntitledGameAchievements(ctx, {
      gameType: GameType.ColorFlood,
      userId: user._id.toString(),
    });
    expect(achievements).to.have.lengthOf(2);
  });
});
