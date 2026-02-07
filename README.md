# One Year Doodle

A daily journal app with a visual garden metaphor. Write one memory per day and watch your garden grow - each day you journal, you get a unique doodle (plant, flower, insect, or tree) to fill that cell in your yearly garden grid.

![One Year Doodle](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003b57?style=flat&logo=sqlite)

## Features

- **Visual Garden Grid** - A year-long calendar where each day is a cell waiting to be filled
- **Unique Doodles** - 50 hand-crafted SVG doodles (plants, flowers, mushrooms, insects, trees)
- **One Entry Per Day** - Encourages daily reflection without overwhelming commitment
- **Smart Doodle Assignment** - Each user gets random doodles with no repeats until all are used
- **Year View** - See your entire year at a glance with smooth scroll to today
- **Edit Past Entries** - Revisit and update memories from previous days
- **Responsive Design** - Beautiful on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT tokens stored in httpOnly cookies
- **Deployment**: Docker with multi-stage Alpine build

## Screenshots

> The garden grid shows your entire year with filled cells displaying unique doodles. Today's cell glows, inviting you to plant a new memory. Future days are dimmed, waiting for their time.

## Getting Started

### Prerequisites

- Node.js 20+
- npm or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/one-year-doodle.git
cd one-year-doodle
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Set your environment variables:
```env
JWT_SECRET=your-super-secret-key-change-this
DATABASE_PATH=data/journal.db
COOKIE_SECURE=false
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Docker Deployment

The easiest way to deploy is using Docker Compose:

```bash
docker-compose up -d
```

This will:
- Build the multi-stage Docker image
- Start the container on port 3000
- Persist your journal data in a Docker volume
- Configure health checks

The app will be available at [http://localhost:3000](http://localhost:3000).

### Environment Variables for Docker

Create a `.env` file in the project root:

```env
JWT_SECRET=your-production-secret-key-here
DATABASE_PATH=data/journal.db
COOKIE_SECURE=true  # Set to false for HTTP deployments
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main garden grid (home)
│   ├── journal/[date]/        # Dynamic route for daily entries
│   ├── login/                 # Login page
│   ├── layout.tsx             # Root layout with providers
│   └── api/
│       ├── auth/              # Authentication endpoints
│       └── entries/           # Journal entry CRUD
├── components/
│   ├── garden/                # Grid visualization components
│   ├── journal/               # Entry display and editing
│   ├── doodles/               # SVG doodle definitions
│   └── ui/                    # Reusable UI components
├── hooks/
│   ├── useAuth.tsx            # Authentication context
│   ├── useJournal.tsx         # Journal data context
│   └── useStorage.tsx         # Data synchronization
├── lib/
│   ├── db.ts                  # SQLite database setup
│   ├── auth.ts                # JWT session management
│   ├── api.ts                 # Backend API client
│   ├── dates.ts               # Date utilities
│   └── doodle-pool.ts         # Random doodle assignment
└── types/
    └── index.ts               # TypeScript type definitions
```

## Development Notes

### Adding New Doodles

Doodles are defined in `src/components/doodles/doodle-data.ts`. Each doodle has:
- A unique ID (1-50, expandable)
- A category (plant, flower, leaf, mushroom, insect, tree)
- A viewBox for SVG scaling
- An array of SVG path strings

To add new doodles, simply add entries to the `DOODLES` array and update `DOODLE_COUNT`.

### Date Format

All dates use the `DateKey` type: `"YYYY-MM-DD"` string format. This ensures consistent parsing and display across the app.

### Authentication Flow

1. User registers/logs in via API routes
2. Server creates a JWT token with userId and username
3. Token stored in httpOnly cookie (secure, httpOnly, sameSite=lax)
4. Middleware verifies token on every protected route
5. Client uses `useAuth` hook to access session data

### Database Schema

```sql
users (id, username, password_hash, created_at)
entries (id, user_id, date_key, text, doodle_id, created_at, updated_at)
UNIQUE(user_id, date_key)  -- One entry per user per day
```

## License

MIT

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
