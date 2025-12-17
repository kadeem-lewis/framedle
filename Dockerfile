ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-slim AS base

# Install curl for health checks or other uses
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Setup PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build


COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

FROM base AS production

# Create a non-root user to run the application
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nuxtjs

USER nuxtjs

COPY --from=build --chown=nuxtjs:nodejs /app/.output .output

EXPOSE 3000

CMD ["node","--import","./.output/server/sentry.server.config.mjs","./.output/server/index.mjs"]