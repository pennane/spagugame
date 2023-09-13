import { ObjectId } from "mongodb";

import { authenticatedService } from "../lib";
import { find } from "../../collections/lib";

const toggleFollow = authenticatedService<
  { userId: string; toggle: boolean },
  { toggle: boolean }
>(async (ctx, { toggle, userId }) => {
  const currentUserId = ctx.user._id;
  const targetUserId = new ObjectId(userId);

  if (currentUserId.equals(targetUserId)) {
    throw new Error("Cannot follow self");
  }

  const targetUser = await find(ctx, "user", { filter: { _id: targetUserId } });
  console.log(targetUser, userId);
  if (!targetUser) {
    throw new Error("User not found");
  }

  if (!toggle) {
    await Promise.all([
      ctx.collections.user.updateOne(
        { _id: currentUserId },
        { $pull: { followingIds: targetUserId.toString() } }
      ),
      ctx.collections.user.updateOne(
        { _id: targetUserId },
        { $pull: { followerIds: currentUserId.toString() } }
      ),
    ]);
    return { toggle: false };
  }

  await Promise.all([
    ctx.collections.user.updateOne(
      { _id: currentUserId },
      { $addToSet: { followingIds: targetUserId.toString() } }
    ),
    ctx.collections.user.updateOne(
      { _id: targetUserId },
      { $addToSet: { followerIds: currentUserId.toString() } }
    ),
  ]);
  return { toggle: true };
});
export default toggleFollow;
