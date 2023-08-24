import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envVariablesSchema = z.object({
  MONGO_CONNECTION_STRING: z.string(),
  MONGO_DB_NAME: z.string(),
  REDIS_PORT: z.number({ coerce: true }).default(6379),
  REDIS_HOST: z.string().default("localhost"),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_CALLBACK_URL: z
    .string()
    .default("http://localhost:3000/auth/github/callback"),
});

export const configObject = envVariablesSchema.parse(process.env);
