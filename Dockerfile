# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV CI=1
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# Включаем corepack для работы с pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---- Dependencies ----
FROM base AS deps
# Для некоторых нативных зависимостей (node-gyp) в Alpine может потребоваться libc6-compat
RUN apk add --no-cache libc6-compat

COPY package.json pnpm-lock.yaml ./
# Флаг --aggregate-output делает логи чище в CI
RUN pnpm install --frozen-lockfile --aggregate-output

# ---- Builder ----
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генерируем Prisma Client (если используется)
RUN pnpm prisma generate

# Собираем приложение (Next.js создаст папку .next/standalone)
RUN pnpm build

# ---- Runner ----
FROM node:22-alpine AS runner
WORKDIR /app

# Исправлено: используем apk вместо apt-get для установки openssl
RUN apk add --no-cache openssl

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Настройка окружения для продакшена
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Копируем только то, что сгенерировал режим standalone (весит в 10 раз меньше)
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# В режиме standalone приложение запускается напрямую через node, pnpm на проде больше не нужен!
CMD ["node", "server.js"]