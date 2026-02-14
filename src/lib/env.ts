/**
 * Environment variable validation
 * Validates required environment variables at application startup
 */

const requiredEnvVars = ["JWT_SECRET"] as const;

const optionalEnvVars = [
  "DATABASE_PATH",
  "COOKIE_SECURE",
  "NODE_ENV",
  "TRUST_PROXY",
  "RATE_LIMIT_STORE",
] as const;

interface EnvConfig {
  jwtSecret: string;
  databasePath: string;
  cookieSecure: boolean;
  nodeEnv: string;
  trustProxy: boolean;
  rateLimitStore: "memory" | "redis";
}

let envConfig: EnvConfig | null = null;

/**
 * Validate and cache environment variables
 * Called once at application startup
 */
export function validateEnv(): EnvConfig {
  if (envConfig) return envConfig;

  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  const rateLimitStore = process.env.RATE_LIMIT_STORE === "redis" ? "redis" : "memory";

  envConfig = {
    jwtSecret: process.env.JWT_SECRET!,
    databasePath: process.env.DATABASE_PATH || "data/journal.db",
    cookieSecure: process.env.COOKIE_SECURE !== "false",
    nodeEnv: process.env.NODE_ENV || "development",
    trustProxy: process.env.TRUST_PROXY === "true",
    rateLimitStore,
  };

  return envConfig;
}

/**
 * Get cached environment config
 * Returns null if validateEnv() hasn't been called
 */
export function getEnv(): EnvConfig | null {
  return envConfig;
}
