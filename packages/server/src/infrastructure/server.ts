import fs from "fs";
import * as R from "ramda";

import { Server, createServer } from "http";
import { WebSocketServer } from "ws";

import express, { Express } from "express";
import cors from "cors";
import { json } from "body-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import MongoStore from "connect-mongo";

import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { useServer } from "graphql-ws/lib/use/ws";

import { ObjectId } from "mongodb";
import { UserRole } from "../graphql/generated/graphql";
import { resolvers } from "../graphql/resolvers/root";
import { IUser } from "../collections/User";

import {
  getGlobalContext,
  getContext,
  TContext,
  TGlobalContext,
} from "./context";

const configurePassport = (ctx: TGlobalContext) => {
  passport.serializeUser(function (user, done) {
    done(null, (user as any)._id);
  });

  passport.deserializeUser(async function (id: string, done) {
    const ctx = await getGlobalContext();
    const user = await ctx.collections.user.findOne({
      _id: new ObjectId(id),
    });

    done(!user ? "no user" : null, user);
  });

  passport.use(
    new GithubStrategy(
      {
        clientID: ctx.config.GITHUB_CLIENT_ID,
        clientSecret: ctx.config.GITHUB_CLIENT_SECRET,
        callbackURL: ctx.config.GITHUB_CALLBACK_URL,
      },
      async function (
        _accessToken: string,
        _refreshToken: string,
        profile: { id: string; displayName?: string; username?: string },
        done: (err: unknown | null, user: IUser | null) => void
      ) {
        const ctx = await getGlobalContext();
        const result = await ctx.collections.user.findOneAndUpdate(
          { githubId: profile.id },
          {
            $setOnInsert: {
              githubId: profile.id,
              roles: [UserRole.User],
              userName: profile.displayName || profile.username,
              joinedAt: new Date(),
            },
          },
          { upsert: true, returnDocument: "after" }
        );

        return done(null, result.value);
      }
    )
  );
};

const createHttpServer = () => {
  const app = express();
  const httpServer = createServer(app);
  return { app, httpServer };
};

const createApolloServer = ({
  app,
  httpServer,
}: {
  app: Express;
  httpServer: Server;
}) => {
  const typeDefs = fs.readFileSync("./src/graphql/schema.graphql", {
    encoding: "utf-8",
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema, context: getContext }, wsServer);

  const apolloServer = new ApolloServer<TContext>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  return { apolloServer, app, httpServer };
};

const startApolloServer = async ({
  apolloServer,
  app,
  httpServer,
}: ReturnType<typeof createApolloServer>) => {
  await apolloServer.start();
  return { apolloServer, app, httpServer };
};

const registerMiddleware =
  (ctx: TGlobalContext) =>
  ({
    apolloServer,
    app,
    httpServer,
  }: Awaited<ReturnType<typeof startApolloServer>>) => {
    app.use(
      session({
        secret: ctx.config.SERVER_SESSION_SECRET,
        saveUninitialized: false,
        resave: true,
        store: MongoStore.create({
          collectionName: "sessions",
          client: ctx.mongoClient,
          dbName: ctx.config.MONGO_DB_NAME,
        }),
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(
      "/graphql",
      cors<cors.CorsRequest>({ origin: "*" }),
      json(),
      expressMiddleware(apolloServer, {
        context: getContext,
      })
    );
    app.get("/auth/github", passport.authenticate("github"));
    app.get(
      "/auth/github/callback",
      passport.authenticate("github", { failureRedirect: "/" }),
      (_req, res) => res.redirect("/")
    );
    app.get("/", (req, res) => {
      res.send(JSON.stringify(req.user));
    });

    return {
      apolloServer,
      httpServer,
      app,
    };
  };

const startHttpServer =
  (ctx: TGlobalContext) =>
  ({ httpServer }: ReturnType<ReturnType<typeof registerMiddleware>>) =>
    new Promise((resolve) =>
      httpServer.listen(ctx.config.HTTP_SERVER_PORT, () =>
        resolve(ctx.config.HTTP_SERVER_PORT)
      )
    );

export const startServer = async () => {
  const ctx = await getGlobalContext();

  return Promise.resolve(configurePassport(ctx))
    .then(createHttpServer)
    .then(R.tap(() => console.log("Created http server")))
    .then(createApolloServer)
    .then(R.tap(() => console.log("Created apollo server")))
    .then(startApolloServer)
    .then(R.tap(() => console.log("Started apollo server")))
    .then(registerMiddleware(ctx))
    .then(R.tap(() => console.log("Registered app middleware")))
    .then(startHttpServer(ctx))
    .then(
      R.tap((port) => console.log(`HTTP server listening on port ${port}`))
    );
};
