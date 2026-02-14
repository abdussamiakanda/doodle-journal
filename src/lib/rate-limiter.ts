/**
 * Rate limiter with pluggable backing store.
 * Default store is in-memory (single instance only).
 */

import { logger } from "@/lib/logger";
import { validateEnv } from "@/lib/env";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitStore {
  get(key: string): RateLimitEntry | undefined;
  set(key: string, value: RateLimitEntry): void;
  delete(key: string): void;
  entries?(): IterableIterator<[string, RateLimitEntry]>;
}

class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, RateLimitEntry>();

  get(key: string): RateLimitEntry | undefined {
    return this.store.get(key);
  }

  set(key: string, value: RateLimitEntry): void {
    this.store.set(key, value);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  entries(): IterableIterator<[string, RateLimitEntry]> {
    return this.store.entries();
  }
}

const memoryStore = new MemoryRateLimitStore();
let activeStore: RateLimitStore = memoryStore;

const env = validateEnv();
if (env.rateLimitStore === "redis") {
  logger.warn("rate-limit", "RATE_LIMIT_STORE=redis requested but redis adapter is not configured; falling back to memory store");
}

// Cleanup old entries every 5 minutes for in-memory store
setInterval(() => {
  if (activeStore !== memoryStore || !memoryStore.entries) return;
  const now = Date.now();
  for (const [key, entry] of memoryStore.entries()) {
    if (entry.resetAt < now) {
      memoryStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
};

export function setRateLimitStore(store: RateLimitStore): void {
  activeStore = store;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  const entry = activeStore.get(key);

  if (!entry || entry.resetAt < now) {
    const resetAt = now + config.windowMs;
    activeStore.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  const nextCount = entry.count + 1;
  activeStore.set(key, { ...entry, count: nextCount });

  return {
    allowed: true,
    remaining: config.maxRequests - nextCount,
    resetAt: entry.resetAt,
  };
}

/**
 * Extract client IP from request headers.
 * Only trusts proxy forwarding headers when TRUST_PROXY=true.
 */
export function getClientIp(request: Request): string {
  const { trustProxy } = validateEnv();

  if (trustProxy) {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }

    const realIp = request.headers.get("x-real-ip");
    if (realIp) {
      return realIp.trim();
    }
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "unknown";
}

export function getRateLimitHeaders(result: RateLimitResult, config: RateLimitConfig): HeadersInit {
  return {
    "X-RateLimit-Limit": config.maxRequests.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.resetAt.toString(),
    "Retry-After": result.allowed ? "0" : Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
  };
}
