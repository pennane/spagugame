import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envVariablesSchema = z.object({
  MONGO_CONNECTION_STRING: z.string(),
  MONGO_DB_NAME: z.string(),
  REDIS_PORT: z.number({ coerce: true }).default(6379),
  REDIS_HOST: z.string().default("localhost"),
});

export const configObject = envVariablesSchema.parse(process.env);
