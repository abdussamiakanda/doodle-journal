# One Year Doodle

A daily journal app with a visual garden: each day of the year is a cell in a grid. Write one memory per day and get a unique doodle (plant, flower, or insect) for that cell.

## Stack

- **Vite** + **React** (JS/JSX)
- **Plain CSS** (no Tailwind)
- **Supabase** (auth + database)

## Setup

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Create a [Supabase](https://supabase.com) project and get your project URL and anon key.

3. Copy the example env file and add your keys:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. In the Supabase SQL editor, run the migrations in `supabase/migrations/` (in order) to create `profiles`, `entries`, RLS, and the `handle_new_user` trigger.

5. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint               |

## Features

- **Auth**: Email/password sign up and sign in via Supabase.
- **Garden**: Year grid where each cell is a day; empty, today (glowing dot), or filled with a doodle.
- **Journal**: Tap a day to view or write your memory; today’s cell opens the editor.
- **Doodles**: Each new entry gets a random doodle from the pool (no duplicates in your year).

## Project structure

```
src/
  app/           # (if any)
  components/     # garden, journal, doodles, ui
  contexts/      # AuthContext, JournalContext
  lib/           # supabase, dates, constants
  pages/         # Login, Home, Journal
  index.css      # Global styles and theme
```

## Environment variables

| Variable               | Description                    |
|------------------------|--------------------------------|
| `VITE_SUPABASE_URL`   | Supabase project URL           |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous (public) key |

## Troubleshooting

**Save / Done button times out or never completes**

- The first request to the `entries` table is hanging (no response from Supabase). Check:
  1. **Project not paused** — [Supabase Dashboard](https://supabase.com/dashboard) → your project. If it says “Project is paused”, click **Restore** and wait until it’s active.
  2. **Network tab** — DevTools → Network → click Done in the app. Find the request to `*.supabase.co` (e.g. `rest/v1/entries`). If it stays **pending**, the project or network is not responding.
  3. **URL and key** — In the dashboard, Settings → API: copy **Project URL** and **anon public** key into `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then restart the dev server (`npm run dev`).

---

One memory per day. One year, one garden.
