import { ReadStream } from "fs";
import { TContext } from "../../infrastructure/context";
import { authenticatedService } from "../lib";
import { get, update } from "../../collections/lib";
import { ObjectId } from "mongodb";

const uploadImage = async (ctx: TContext, stream: ReadStream) => {
  const response = await ctx.imgur.upload({
    image: stream as any,
    type: "stream",
  });

  if (response.status !== 200 || typeof response?.data?.link !== "string") {
    throw new Error("Upload failed " + JSON.stringify(response));
  }

  return response.data.link;
};

const uploadProfilePicture = authenticatedService<
  { userId: ObjectId; file: any },
  { success: boolean }
>(async (ctx, { file, userId }) => {
  const user = await get(ctx, "user", { filter: { _id: userId } });
  const oldProfilePictureUrl = user?.profilePictureUrl || null;
  if (!user) {
    throw new Error("User not found");
  }
  console.log(file);
  const { createReadStream } = await file;
  const newProfilePictureUrl = await uploadImage(ctx, createReadStream());

  if (oldProfilePictureUrl) {
    await ctx.imgur.deleteImage(oldProfilePictureUrl);
  }
  await update(ctx, "user", {
    filter: { _id: userId },
    update: { profilePictureUrl: newProfilePictureUrl },
  });
  return { success: true };
});
export default uploadProfilePicture;
