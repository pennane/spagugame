import { ReadStream } from "fs";
import { TContext } from "../../infrastructure/context";
import { authenticatedService } from "../lib";
import { get, update } from "../../collections/lib";
import { ObjectId } from "mongodb";
import { Image } from "../../graphql/generated/graphql";

const uploadImage = async (
  ctx: TContext,
  stream: ReadStream
): Promise<Image> => {
  const response = await ctx.imgur.upload({
    image: stream as any,
    type: "stream",
  });

  if (response.status !== 200 || typeof response?.data?.link !== "string") {
    throw new Error("Upload failed " + JSON.stringify(response));
  }

  return {
    hash: response.data.deletehash,
    url: response.data.link,
    id: response.data.id,
  };
};

const uploadProfilePicture = authenticatedService<
  { userId: ObjectId; file: any },
  { success: boolean }
>(async (ctx, { file, userId }) => {
  try {
    const user = await get(ctx, "user", { filter: { _id: userId } });
    const oldDeleteHash = user?.profilePicture?.hash || null;

    if (!user) {
      throw new Error("User not found");
    }

    const { createReadStream } = await file;
    const profilePicture = await uploadImage(ctx, createReadStream());

    if (oldDeleteHash) {
      await ctx.imgur.deleteImage(oldDeleteHash);
    }
    await update(ctx, "user", {
      filter: { _id: userId },
      update: { profilePicture },
    });
    return { success: true };
  } catch (e) {
    throw new Error("Failed to upload profile picture");
  }
});
export default uploadProfilePicture;
