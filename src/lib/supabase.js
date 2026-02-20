import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const key = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  ""
).trim();

if (!url || !key) {
  console.warn(
    "Missing Supabase env. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and restart the dev server (npm run dev)."
  );
}

// Auth in memory only (no localStorage). See https://supabase.com/docs/guides/auth
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: false },
      })
    : null;

if (import.meta.env.DEV && supabase) {
  window.__SUPABASE__ = supabase;
}
