import { IAchievement } from "../../collections/Achievement/Achievement";
import { TServiceHandler } from "../models";
import { ObjectId } from "mongodb";

const giveAchievement: TServiceHandler<
  { userId: string; achievementId: string },
  { achievement: IAchievement | null }
> = async (ctx, { achievementId, userId }) => {
  const achievement = await ctx.collections.achievement.findOne({
    _id: new ObjectId(achievementId),
  });

  if (!achievement) throw new Error(`Achievement ${achievementId} not found`);

  const result = await ctx.collections.user.updateOne(
    { _id: new ObjectId(userId) },
    { $addToSet: { achievementIds: achievementId } }
  );
  return {
    achievement: result.modifiedCount === 1 ? achievement : null,
  };
};

export default giveAchievement;
