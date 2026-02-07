# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

One Year Doodle is a daily journal app with a visual garden metaphor. Each day of the year corresponds to a cell in a garden grid - users write one memory per day and get assigned a unique doodle (plant/flower/insect) to fill that cell. The app is built with Next.js 14 App Router, TypeScript, and SQLite.

## Common Commands

```bash
# Development
npm run dev          # Start dev server on :3000

# Build & Deploy
npm run build        # Create production build
npm start           # Run production server (requires build first)

# Docker deployment
docker-compose up   # Build and run with SQLite persistence

# Code Quality
npm run lint        # Run ESLint
```

## Architecture

### App Structure (Next.js App Router)

- **`src/app/`** - Next.js App Router pages and API routes
  - `page.tsx` - Main garden grid view (home)
  - `journal/[date]/page.tsx` - Individual journal entry page with dynamic routing
  - `api/auth/*` - Authentication endpoints (register, login, logout, me)
  - `api/entries/*` - Journal entry CRUD operations

### Key Directories

- **`src/lib/`** - Core business logic and utilities
  - `db.ts` - SQLite database singleton with schema initialization
  - `auth.ts` - JWT session management (jose library)
  - `api.ts` - Backend API client for data fetching
  - `dates.ts` - Date utilities for year calculations, validation
  - `doodle-pool.ts` - Random doodle assignment avoiding duplicates

- **`src/hooks/`** - React context providers for state management
  - `useAuth.tsx` - Authentication context (session management)
  - `useJournal.tsx` - Journal data context (entries, CRUD operations)
  - `useStorage.tsx` - Data synchronization between client and server

- **`src/components/`** - React components
  - `garden/` - Garden grid visualization (YearHeader, GardenGrid, GardenCell)
  - `journal/` - Entry display and editing (JournalHeader, JournalEditor, EntryDisplay)
  - `doodles/` - SVG doodle definitions (DoodleIcon, doodle-data.ts)

- **`src/types/index.ts`** - TypeScript type definitions (DateKey, DoodleId, JournalEntry, etc.)

### Data Flow

1. **Authentication**: JWT tokens stored in httpOnly cookies, verified in middleware
2. **Database**: SQLite with better-sqlite3, single file at `data/journal.db`
3. **State Management**: React Context (useAuth, useJournal) synced with server via API
4. **Doodle Assignment**: Server assigns random unused doodle ID on entry creation

### Important Patterns

- **DateKey format**: All dates use `"YYYY-MM-DD"` string format
- **Doodle IDs**: 1-50 (defined in `doodle-data.ts`), expandable
- **Middleware**: Protects all routes except `/login` and auth API endpoints
- **Standalone output**: Next.js configured for Docker deployment (`output: "standalone"`)

### Environment Variables

Required for production/Docker:
- `JWT_SECRET` - Secret key for JWT signing
- `DATABASE_PATH` - SQLite database path (default: `data/journal.db`)
- `COOKIE_SECURE` - Set to `false` for HTTP deployments (default: `true` in production)

### Docker Deployment

Uses multi-stage Alpine build with persistent volume for SQLite data. The database lives at `/app/data/journal.db` inside the container.
