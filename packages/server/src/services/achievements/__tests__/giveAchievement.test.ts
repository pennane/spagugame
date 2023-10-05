import { expect } from "chai";

import giveAchievement from "../giveAchievement";
import { createMockContext } from "../../../infrastructure/testing/mock";
import { testACL } from "../../../infrastructure/testing/acl";
import { clearDatabase } from "../../../infrastructure/testing/db";
import { ACHIEVEMENTS } from "../../../collections/Achievement/Achievement";
import { ObjectId } from "mongodb";

describe("achievements.giveAchievement", async () => {
  beforeEach(async () => await clearDatabase());
  after(clearDatabase);
  before(() =>
    testACL({ authenticatedService: true, service: giveAchievement })
  );

  it("should give achievements", async () => {
    const { ctx, user: userBefore } = await createMockContext({
      authenticated: true,
    });

    let userAfter = await ctx.collections.user.findOne({ _id: userBefore._id });

    expect(
      userAfter?.achievementIds,
      "should not have any achievements"
    ).to.have.lengthOf(0);

    await giveAchievement(ctx, {
      userId: userBefore._id.toString(),
      achievementId: ACHIEVEMENTS[0]._id.toString(),
    });

    userAfter = await ctx.collections.user.findOne({
      _id: userBefore._id,
    });

    expect(
      userAfter?.achievementIds,
      "Should have one achievement"
    ).to.have.members([ACHIEVEMENTS[0]._id.toString()]);
  });

  it("should not give achievement if it does not exist", async () => {
    const { ctx, user: userBefore } = await createMockContext({
      authenticated: true,
    });

    let userAfter = await ctx.collections.user.findOne({ _id: userBefore._id });

    expect(
      userAfter?.achievementIds,
      "should not have any achievements"
    ).to.have.lengthOf(0);

    try {
      await giveAchievement(ctx, {
        userId: userBefore._id.toString(),
        achievementId: new ObjectId().toString(),
      });
    } catch (e: any) {
      expect(e.message).to.equal("Achievement does not exist");
    }

    userAfter = await ctx.collections.user.findOne({
      _id: userBefore._id,
    });

    expect(
      userAfter?.achievementIds,
      "Should have no achievements"
    ).to.have.lengthOf(0);
  });
});
