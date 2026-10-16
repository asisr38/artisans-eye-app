# syntax=docker/dockerfile:1

# Node 24 LTS matches .nvmrc and "engines". The pnpm version must match
# "packageManager" in package.json so the lockfile and the Fiber patch resolve
# exactly as they do locally.
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat && npm install -g pnpm@11.2.2
WORKDIR /app

# ---- dependencies ----------------------------------------------------------
FROM base AS deps
# pnpm-workspace.yaml references patches/@react-three__fiber@9.6.1.patch and the
# lockfile records that patch's hash, so both must be present before install.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile

# ---- build -----------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# ---- runtime ---------------------------------------------------------------
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# next.config.ts sets output: 'standalone', so .next/standalone already contains
# server.js and the traced node_modules. Nothing is installed in this stage.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Alpine has busybox wget but no curl.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
