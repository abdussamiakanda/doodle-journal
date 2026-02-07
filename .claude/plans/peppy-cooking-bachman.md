# Docker Deployment

## Context

The app uses Next.js 14 + SQLite (better-sqlite3) with JWT auth. We need Docker deployment that properly handles the native SQLite module compilation, persists the database via volumes, and produces a minimal production image.

---

## Files to Create (3)

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build (deps -> build -> runtime) |
| `docker-compose.yml` | Single-service deployment with volume persistence |
| `.dockerignore` | Keep build context small |

## Files to Modify (1)

| File | Change |
|------|--------|
| `next.config.mjs` | Add `output: "standalone"` for minimal production image |

---

## Key Decisions

- **Node 20 Alpine** for build stages (has build tools for better-sqlite3 native compilation)
- **Node 20 Slim** for runtime (smaller, better glibc compat with native modules)
- **Standalone output** reduces image from ~1GB to ~150-200MB
- **npm** for Docker installs (standard Node ecosystem, avoids Bun Docker quirks)
- **Non-root user** (nodejs:1001) for security

---

## Dockerfile - 3-stage build

```
Stage 1 "deps": node:20-alpine
  - Install build tools (python3, make, g++) for better-sqlite3
  - Copy package.json + bun.lockb
  - npm install --production=false (compiles native modules)

Stage 2 "builder": node:20-alpine
  - Copy node_modules from deps
  - Copy all source code
  - npm run build (standalone output)

Stage 3 "runner": node:20-slim
  - Create nodejs user (uid 1001)
  - Copy .next/standalone from builder
  - Copy .next/static from builder
  - Copy public/ from builder
  - Create /app/data directory owned by nodejs
  - ENV: NODE_ENV=production, PORT=3000, HOSTNAME=0.0.0.0
  - EXPOSE 3000
  - VOLUME /app/data
  - HEALTHCHECK via wget on localhost:3000
  - USER nodejs
  - CMD ["node", "server.js"]
```

## docker-compose.yml

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - DATABASE_PATH=data/journal.db
    volumes:
      - journal-data:/app/data
    restart: unless-stopped
    healthcheck: wget --spider -q http://localhost:3000

volumes:
  journal-data:
```

## .dockerignore

Exclude: `node_modules`, `.next`, `.git`, `.claude`, `data/`, `.env*`, `*.md`

## next.config.mjs change

Add `output: "standalone"` alongside existing experimental config.

---

## Verification

1. `docker compose build` -- builds without errors
2. `JWT_SECRET=test123 docker compose up` -- starts, accessible at :3000
3. Visit localhost:3000 -- redirected to /login
4. Register + create entry -- works
5. `docker compose down && docker compose up` -- data persists (volume)
6. `docker compose down -v` -- data gone (volume removed)
