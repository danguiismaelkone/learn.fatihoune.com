# FATIHOUNE Formation — single image: Next.js + Payload + SQLite.
# Build once per environment (pre-production / production): see docker-compose.yml and deploy/README.md.
FROM node:22-alpine AS base
# pnpm is fetched once here, in a cache readable by every user: the runtime user (nextjs) would otherwise
# download it from the npm registry on each container start (and fail to start without internet access).
# Version: keep in sync with "packageManager" in package.json.
ENV COREPACK_HOME=/opt/corepack COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN apk add --no-cache libc6-compat && corepack enable && corepack prepare pnpm@10.30.0 --activate \
    && chmod -R a+rX /opt/corepack
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Indexing (robots meta) and canonical URLs are baked into pre-rendered pages.
ARG SITE_ENV=preview
ARG NEXT_PUBLIC_SITE_URL
ENV SITE_ENV=$SITE_ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN test -n "$NEXT_PUBLIC_SITE_URL" || (echo "NEXT_PUBLIC_SITE_URL build arg is required" && exit 1)
# Throwaway build database: pages are pre-rendered from the seeded content, then refreshed at runtime (ISR + on-save revalidation).
RUN export DATABASE_URL=file:/tmp/build.db PAYLOAD_SECRET=build-only-secret MEDIA_DIR=/tmp/media && \
    pnpm payload migrate && pnpm seed && pnpm build && rm -f /tmp/build.db

FROM base AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
# Never reach the registry at runtime: pnpm comes from the cache prepared above.
ENV COREPACK_ENABLE_NETWORK=0
RUN apk add --no-cache wget && addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs
COPY --from=builder --chown=nextjs:nodejs /app ./
RUN mkdir -p /data/media && chown -R nextjs:nodejs /data
USER nextjs
EXPOSE 3000
# The first start creates the database and imports the content: about 4 minutes on a slow disk (2026-10-05).
# Failures during the 10-minute start period are not counted; it ends as soon as the site answers.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10m --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/healthz >/dev/null || exit 1
# Apply pending migrations, import the validated content into an empty database (first start only), then start.
CMD ["sh", "-c", "pnpm payload migrate && pnpm seed:if-empty && pnpm start"]
