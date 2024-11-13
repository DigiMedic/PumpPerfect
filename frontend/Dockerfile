# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Kopírování package.json a package-lock.json
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Kopírování dependencies z předchozího stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build aplikace
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Kopírování potřebných souborů z builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Nastavení uživatele pro bezpečnost
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Expose port
EXPOSE 3000

# Spuštění aplikace
CMD ["node", "server.js"]
