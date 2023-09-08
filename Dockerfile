FROM node:18-bullseye-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --filter server...

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter server...
RUN pnpm run --filter server build 

FROM base
COPY --from=prod-deps /app/packages/server/node_modules/ /app/packages/server/node_modules
COPY --from=build /app/packages/server/dist /app/packages/server/dist
WORKDIR /app/packages/server
EXPOSE 3000
CMD [ "pnpm", "start" ]