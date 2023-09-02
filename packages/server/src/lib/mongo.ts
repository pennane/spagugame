import crypto from "node:crypto";
import { ObjectId } from "mongodb";
export const mongoIdFromSeed = (seed: string, date = "2000-01-01") => {
  return new ObjectId(
    ((new Date(date).getTime() / 1000) | 0).toString(16) +
      crypto.createHash("md5").update(seed).digest("hex").substring(0, 16)
  );
};
