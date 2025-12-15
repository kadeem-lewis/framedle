ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-slim as base

# Setup PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

ARG NUXT_PUBLIC_DISCORD_INVITE
ARG NUXT_PUBLIC_KOFI_URL
ARG NUXT_PUBLIC_SCRIPTS_UMAMI_ANALYTICS_WEBSITE_ID

FROM base as deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base as build


COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

FROM base as production

# Create a non-root user to run the application
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nuxtjs

USER nuxtjs

COPY --from=build --chown=nuxtjs:nodejs /app/.output .output

EXPOSE 3000

CMD ["node","--import","./.output/server/sentry.server.config.mjs","./.output/server/index.mjs"]