export const COLORS = {
  bg: "#2400B0",
  bgDark: "#1A0080",
  cream: "#FFFDF5",
  creamDark: "#F5F0E0",
  accent: "#3300FF",
  accentLight: "#5533FF",
  ink: "#1A1A4E",
  dot: "#6B6BAA",
  dotEmpty: "#4A4A8A",
  dotFuture: "#3A3A6A",
} as const;

export const GRID_GAP = 2; // px
export const CELL_SIZE_SM = 20; // px base on small screens
export const CELL_SIZE_LG = 24; // px base on large screens

export const MAX_ENTRY_LENGTH = 500;

// Security constants
export const BCRYPT_SALT_ROUNDS = 10;
export const JWT_EXPIRY_DAYS = 30;
export const COOKIE_NAME = "session";

// Rate limiting
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 5;

// Password requirements
export const MIN_PASSWORD_LENGTH = 8;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
