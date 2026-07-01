import { createClient } from "@supabase/supabase-js";

/**
 * Public Supabase client using the anon key. Subject to Row Level Security,
 * so it can only read what RLS policies allow (e.g. approved reviews).
 * Returns null if env isn't configured yet, so callers can fall back gracefully.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon || anon.startsWith("your-")) {
    return null;
  }

  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
