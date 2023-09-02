import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envVariablesSchema = z.object({
  HTTP_SERVER_PORT: z.number({ coerce: true }).default(3000),
  SERVER_SESSION_SECRET: z.string(),
  SERVER_SESSION_COOKIE_NAME: z.string().default("connect.sid"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
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

export const CONFIG_OBJECT = envVariablesSchema.parse(process.env);
