# SQLite Backend + Simple Auth

## Context

The app currently stores all journal data in browser localStorage. This means data is tied to a single browser and can't survive a cache clear. We're adding a SQLite backend with simple username/password auth so each user has their own persistent garden.

**Goal**: Replace localStorage with server-side SQLite, add login/register, keep the same UI.

---

## New Dependencies

```bash
bun add better-sqlite3 jose bcryptjs
bun add -d @types/better-sqlite3 @types/bcryptjs
```

- **better-sqlite3** -- Sync SQLite (works in Next.js API routes, no ORM)
- **jose** -- JWT create/verify (Edge-compatible for middleware)
- **bcryptjs** -- Pure JS bcrypt (no native compilation issues)

---

## DB Schema

```sql
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS entries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  date_key   TEXT NOT NULL,
  text       TEXT NOT NULL,
  doodle_id  INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, date_key)
);

CREATE INDEX IF NOT EXISTS idx_entries_user_year ON entries(user_id, date_key);
```

No separate `used_doodle_ids` table -- derived via `SELECT DISTINCT doodle_id`.

---

## API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth/register` | Create account, set session cookie |
| POST | `/api/auth/login` | Log in, set session cookie |
| POST | `/api/auth/logout` | Clear session cookie |
| GET | `/api/auth/me` | Check current session |
| GET | `/api/entries?year=2026` | All entries for year (returns `{ entries, usedDoodleIds }`) |
| POST | `/api/entries` | Create entry `{ dateKey, text }` -> assigns doodleId server-side |
| PUT | `/api/entries/[dateKey]` | Update entry `{ text }` |

Auth: JWT in httpOnly cookie, 30-day expiry. Middleware redirects unauthenticated users to `/login`.

---

## New Files (13)

| File | Purpose |
|------|---------|
| `src/lib/db.ts` | SQLite singleton + schema auto-init |
| `src/lib/auth.ts` | JWT create/verify/getSession |
| `src/lib/api.ts` | Frontend fetch client |
| `src/middleware.ts` | Route protection (Edge-compatible, uses `jose`) |
| `src/app/api/auth/register/route.ts` | Registration |
| `src/app/api/auth/login/route.ts` | Login |
| `src/app/api/auth/logout/route.ts` | Logout |
| `src/app/api/auth/me/route.ts` | Session check |
| `src/app/api/entries/route.ts` | GET all / POST new |
| `src/app/api/entries/[dateKey]/route.ts` | GET / PUT single |
| `src/app/login/page.tsx` | Login/register UI |
| `src/hooks/useAuth.ts` | Auth context + useAuth hook |
| `.env.local` | `JWT_SECRET`, `DATABASE_PATH` |

## Modified Files (7)

| File | Change |
|------|--------|
| `src/hooks/useStorage.ts` | Replace localStorage with `api.getEntries()` fetch |
| `src/hooks/useJournal.ts` | `addEntry`/`updateEntry` now call API (async) |
| `src/components/journal/JournalEditor.tsx` | `handleSave` becomes async/await |
| `src/app/layout.tsx` | Wrap with `AuthProvider` |
| `src/components/garden/YearHeader.tsx` | Add logout button |
| `next.config.mjs` | Add `serverExternalPackages: ["better-sqlite3"]` |
| `.gitignore` | Add `/data/`, `*.db*` |

## Deleted Files

| File | Reason |
|------|--------|
| `src/lib/storage.ts` | Replaced by API layer |

---

## Implementation Order

1. **Install deps** -- `bun add better-sqlite3 jose bcryptjs` + dev types
2. **Config** -- Update `next.config.mjs` (`serverExternalPackages`), `.gitignore`, create `.env.local`
3. **DB layer** -- `src/lib/db.ts` (singleton + schema)
4. **Auth lib** -- `src/lib/auth.ts` (JWT helpers)
5. **Auth API routes** -- register, login, logout, me
6. **Middleware** -- `src/middleware.ts` (protect routes, redirect to /login)
7. **Login page** -- `src/app/login/page.tsx` (reuse Card/Button components)
8. **API client** -- `src/lib/api.ts`
9. **Entry API routes** -- `/api/entries` and `/api/entries/[dateKey]`
10. **Rewire frontend** -- Rewrite `useStorage.ts` + `useJournal.ts` (async), update `JournalEditor.tsx`
11. **Auth context** -- `useAuth.ts`, update `layout.tsx`, add logout to YearHeader
12. **Cleanup** -- Delete `src/lib/storage.ts`

---

## Key Design Decisions

- **Async interface change**: `addEntry`/`updateEntry` become `Promise`-returning. Only `JournalEditor.tsx` needs updating (already has `isSaving` state). All read-only consumers (`GardenGrid`, `EntryDisplay`) are unaffected.
- **Doodle assignment moves server-side**: `POST /api/entries` calls `getRandomUnusedDoodleId` on the server to avoid race conditions.
- **No optimistic updates**: For this small app, awaiting the server response before navigating is simpler and avoids rollback complexity.
- **Edge-safe middleware**: Middleware uses `jose` only (no `better-sqlite3`). DB access only in API route handlers.

---

## Verification

1. `bun run dev` -- starts without errors
2. Visit `/` -- redirected to `/login`
3. Register a new user -- redirected to garden
4. Click today's dot, write entry, save -- entry persists
5. Refresh page -- entry still there (DB, not localStorage)
6. Open a different browser / incognito -- can register a second user with separate garden
7. Click logout in header -- redirected to login
8. Check `data/journal.db` exists with correct schema
