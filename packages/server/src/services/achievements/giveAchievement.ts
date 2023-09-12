import { TServiceHandler } from "../models";
import { ObjectId } from "mongodb";

const giveAchievement: TServiceHandler<
  { userId: string; achievementId: string },
  boolean
> = async (ctx, { achievementId, userId }) => {
  const achievement = await ctx.collections.achievement.findOne({
    _id: new ObjectId(achievementId),
  });

  if (!achievement) throw new Error(`Achievement ${achievementId} not found`);

  const result = await ctx.collections.user.updateOne(
    { _id: new ObjectId(userId) },
    { $addToSet: { achievementIds: achievementId } }
  );
  return result.modifiedCount === 1;
};

export default giveAchievement;
