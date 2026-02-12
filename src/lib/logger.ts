/**
 * Simple logger utility that respects environment
 * Sanitizes error output in production to prevent information leakage
 */

type LogLevel = "error" | "warn" | "info" | "debug";

const isDevelopment = process.env.NODE_ENV !== "production";

function formatMessage(level: LogLevel, context: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`;
}

function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // In production, only log the message, not the stack
    if (isDevelopment) {
      return `${error.message}\n${error.stack}`;
    }
    return error.message;
  }
  return String(error);
}

export const logger = {
  error(context: string, error: unknown): void {
    const message = formatMessage("error", context, sanitizeError(error));
    console.error(message);
  },

  warn(context: string, message: string): void {
    if (isDevelopment) {
      console.warn(formatMessage("warn", context, message));
    }
  },

  info(context: string, message: string): void {
    if (isDevelopment) {
      console.log(formatMessage("info", context, message));
    }
  },

  debug(context: string, message: string): void {
    if (isDevelopment) {
      console.log(formatMessage("debug", context, message));
    }
  },
};

// Convenience function for catching and logging errors
export function logError(context: string): (error: unknown) => void {
  return (error: unknown) => logger.error(context, error);
}
