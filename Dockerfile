FROM node:lts-buster-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS base-s
WORKDIR /app
COPY ./server/package*.json /app

FROM base AS base-c
WORKDIR /client
COPY ./client/package*.json /client

FROM base-s AS s-prod
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends --no-cache dumb-init 
EOF
ENV NODE_ENV=production
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base-c AS c-prod
ENV NODE_ENV=production
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base-s AS s-build
RUN --mount=type=cache,id=npm,target=/pnpm/store pnpm install --frozen-lockfile
COPY ./server /app
CMD [ "pnpm", "run", "build" ]

FROM base-c AS c-build
RUN --mount=type=cache,id=npm,target=/pnpm/store pnpm install --frozen-lockfile
COPY ./client /client
CMD [ "pnpm", "run", "build" ]

FROM base-s AS s-dev
ENV NODE_ENV=development
RUN --mount=type=cache,id=npm,target=/pnpm/store pnpm install
COPY ./server /app
EXPOSE 3000
CMD [ "pnpm", "run", "dev" ]

FROM base-c AS c-dev
RUN --mount=type=cache,id=npm,target=/pnpm/store pnpm install
COPY ./client /client
EXPOSE 1234
CMD ["pnpm", "run", "dev"]

FROM base AS s-final
ENV NODE_ENV=production
COPY --from=s-prod /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=s-prod /app/node_modules /app/node_modules
COPY --from=s-build /app/dist /app/dist
EXPOSE 5000
CMD [ "dumb-init" "node", "index.js" ]

FROM base as c-final
