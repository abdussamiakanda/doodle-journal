# Stage 1: Install dependencies and compile native modules
FROM node:20-alpine AS deps

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json bun.lockb ./
RUN npm install --production=false

# Stage 2: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Stage 3: Production runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nodejs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN mkdir -p /app/data && chown nodejs:nodejs /app/data

VOLUME /app/data

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:3000 || exit 1

USER nodejs

CMD ["node", "server.js"]
