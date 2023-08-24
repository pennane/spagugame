import fs from "fs";

import { createServer } from "http";
import { WebSocketServer } from "ws";

import express from "express";
import cors from "cors";
import { json } from "body-parser";
import session from "express-session";
import bodyParser from "body-parser";
import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";

import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { useServer } from "graphql-ws/lib/use/ws";

import {
  TContext,
  getContext,
  getGlobalContext,
} from "./infrastructure/context";

import { resolvers } from "./graphql/resolvers/root";
import { configObject } from "./infrastructure/config";
import { UserRole } from "./graphql/generated/graphql";
import { IUser } from "./services/user/models";
import { ObjectId } from "mongodb";

passport.serializeUser(function (user, done) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  done(null, (user as any)._id);
});

passport.deserializeUser(async function (id: string, done) {
  const ctx = await getGlobalContext();
  const user = await ctx.collections.user.findOne({ _id: new ObjectId(id) });
  done(!user ? "no user" : null, user);
});

passport.use(
  new GithubStrategy(
    {
      clientID: configObject.GITHUB_CLIENT_ID,
      clientSecret: configObject.GITHUB_CLIENT_SECRET,
      callbackURL: configObject.GITHUB_CALLBACK_URL,
    },
    async function (
      _accessToken: string,
      _refreshToken: string,
      profile: { id: string },
      done: (err: unknown | null, user: IUser | null) => void
    ) {
      const ctx = await getGlobalContext();
      const result = await ctx.collections.user.findOneAndUpdate(
        { githubId: profile.id },
        { $setOnInsert: { githubId: profile.id, roles: [UserRole.User] } },
        { upsert: true, returnDocument: "after" }
      );

      return done(null, result.value);
    }
  )
);

const typeDefs = fs.readFileSync("./src/graphql/schema.graphql", {
  encoding: "utf-8",
});

const app = express();

const schema = makeExecutableSchema({ typeDefs, resolvers });

const httpServer = createServer(app);

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

apolloServer
  .start()
  .then(() => {
    app
      .use((req, res, next) => {
        console.log({ headers: req.headers });
        next();
      })
      .use(bodyParser.urlencoded({ extended: true }))
      .use(bodyParser.json())
      .use(
        session({
          secret: "keyboard cat",
          saveUninitialized: false,
          resave: true,
        })
      )
      .use(passport.initialize())
      .use(passport.session())
      .use((req, res, next) => {
        console.log({ user: req.user });
        next();
      })
      .use(
        "/graphql",
        cors<cors.CorsRequest>({ origin: "*" }),
        json(),
        expressMiddleware(apolloServer, {
          context: getContext,
        }),
        (req, res, next) => {
          console.log({ user: req.user });
          next();
        }
      )
      .get("/auth/github", passport.authenticate("github"))
      .get(
        "/auth/github/callback",
        passport.authenticate("github", { failureRedirect: "/" }),
        (_req, res) => res.redirect("/")
      )
      .use((req, res, next) => {
        console.log({ user: req.user });
        next();
      })
      .get("/", (req, res) => {
        res.send(JSON.stringify(req.user));
      });

    httpServer.listen(3000, () =>
      console.log("express listening on port 3000")
    );
  })
  .catch(console.error);
