import { expect } from "chai";

import konami from "../konami";
import { createMockContext } from "../../../infrastructure/testing/mock";
import { testACL } from "../../../infrastructure/testing/acl";
import { clearDatabase } from "../../../infrastructure/testing/db";

describe("achievements.konami", async () => {
  beforeEach(async () => await clearDatabase());
  after(clearDatabase);
  before(() => testACL({ authenticatedService: true, service: konami }));

  it("should give konami achievement", async () => {
    const { ctx, user } = await createMockContext({ authenticated: true });
    await konami(ctx, {
      tokens: [
        "ooga",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "b",
        "booga",
      ],
    });

    let userAfter = await ctx.collections.user.findOne({ _id: user._id });

    expect(
      userAfter?.achievementIds,
      "should not have any achievements"
    ).to.have.lengthOf(0);

    await konami(ctx, {
      tokens: [
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "b",
        "a",
      ],
    });

    userAfter = await ctx.collections.user.findOne({
      _id: user._id,
    });

    expect(
      userAfter?.achievementIds,
      "Should have one achievement"
    ).to.have.lengthOf(1);
  });
});
