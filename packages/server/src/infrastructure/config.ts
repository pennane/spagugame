import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envVariablesSchema = z.object({
  MONGO_CONNECTION_STRING: z.string(),
  MONGO_DB_NAME: z.string(),
});

export const configObject = envVariablesSchema.parse(process.env);
