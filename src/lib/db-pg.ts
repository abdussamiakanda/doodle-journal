import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";
import { validateEnv } from "./env";

let pool: Pool | null = null;
let initialized = false;

/**
 * Get PostgreSQL connection pool
 * Uses connection pooling for serverless environments
 */
export function getPool(): Pool {
  if (pool) return pool;

  const env = validateEnv();

  pool = new Pool({
    connectionString: env.postgresUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  // Handle pool errors
  pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err);
  });

  return pool;
}

/**
 * Ensure schema is initialized (lazy initialization)
 */
async function ensureInitialized(): Promise<void> {
  if (initialized) return;

  try {
    await initSchema();
    initialized = true;
  } catch (error) {
    console.error("Failed to initialize PostgreSQL schema:", error);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient(): Promise<PoolClient> {
  return getPool().connect();
}

/**
 * Execute a query with parameters
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  await ensureInitialized();
  const result = await getPool().query<T>(text, params);
  return result;
}

/**
 * Initialize schema (called on app startup)
 */
export async function initSchema(): Promise<void> {
  const pool = getPool();

  // Create users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id              SERIAL PRIMARY KEY,
      username        VARCHAR(255) NOT NULL UNIQUE,
      password_hash  TEXT NOT NULL,
      token_version  INTEGER NOT NULL DEFAULT 0,
      created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create entries table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS entries (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id),
      date_key    VARCHAR(10) NOT NULL,
      text        TEXT NOT NULL,
      doodle_id   INTEGER NOT NULL,
      created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, date_key)
    )
  `);

  // Create index for faster lookups
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_entries_user_year
    ON entries(user_id, date_key)
  `);

  console.log("PostgreSQL schema initialized");
}

/**
 * Close the pool (for graceful shutdown)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
