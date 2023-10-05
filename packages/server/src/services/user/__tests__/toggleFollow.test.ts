import { expect } from "chai";

import toggleFollow from "../toggleFollow";
import {
  createMockContext,
  createMockUser,
} from "../../../infrastructure/testing/mock";
import { testACL } from "../../../infrastructure/testing/acl";
import { clearDatabase } from "../../../infrastructure/testing/db";
import { create, get, update } from "../../../collections/lib";
import { ObjectId } from "mongodb";

describe("user.toggleFollow", async () => {
  beforeEach(async () => await clearDatabase());
  after(clearDatabase);
  before(() => testACL({ authenticatedService: true, service: toggleFollow }));

  it("should follow user", async () => {
    const { ctx, user } = await createMockContext({
      authenticated: true,
    });
    const res = await create(
      ctx,
      "user",
      createMockUser({ followerIds: [], followingIds: [] })
    );

    await toggleFollow(ctx, {
      toggle: true,
      userId: res.insertedId.toString(),
    });

    const updatedUser = await get(ctx, "user", {
      filter: { _id: new ObjectId(user._id.toString()) },
    });
    const updatedUser2 = await get(ctx, "user", {
      filter: { _id: new ObjectId(res.insertedId.toString()) },
    });
    expect(updatedUser?.followingIds).to.deep.equal([
      res.insertedId.toString(),
    ]);
    expect(updatedUser2?.followerIds).to.deep.equal([user._id.toString()]);
  });
  it("should unfollow user", async () => {
    const { ctx, user } = await createMockContext({
      authenticated: true,
    });
    const res = await create(
      ctx,
      "user",
      createMockUser({ followerIds: [user._id.toString()], followingIds: [] })
    );
    await update(ctx, "user", {
      filter: { _id: user._id },
      update: { followingIds: [res.insertedId.toString()] },
    });

    await toggleFollow(ctx, {
      toggle: false,
      userId: res.insertedId.toString(),
    });

    const updatedUser = await get(ctx, "user", {
      filter: { _id: new ObjectId(user._id.toString()) },
    });
    const updatedUser2 = await get(ctx, "user", {
      filter: { _id: new ObjectId(res.insertedId.toString()) },
    });
    expect(updatedUser?.followingIds).to.have.lengthOf(0);
    expect(updatedUser2?.followerIds).to.have.lengthOf(0);
  });
});
