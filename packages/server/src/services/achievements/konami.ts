import { authenticatedService } from "../lib";
import giveAchievement from "./giveAchievement";
import { KONAMI_ACHIEVEMENT } from "../../collections/Achievement/Achievement";
import { getAchievementUnlockKey } from "../ongoingGame/lib/publish";

const SECRET_SEQUENCE = [
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const konami = authenticatedService<{ tokens: string[] }, { success: boolean }>(
  async (ctx, { tokens }) => {
    if (tokens.join === SECRET_SEQUENCE.join) {
      const { achievement } = await giveAchievement(ctx, {
        userId: ctx.user._id.toString(),
        achievementId: KONAMI_ACHIEVEMENT._id.toString(),
      });

      if (achievement) {
        await ctx.pubsub.publish(
          getAchievementUnlockKey(ctx.user._id.toString()),
          {
            achievementUnlock: [achievement],
          }
        );
      }

      return { success: !!achievement };
    }

    return { success: false };
  }
);
export default konami;
