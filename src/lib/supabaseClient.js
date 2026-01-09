// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Make sure these are in your .env.local
// NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
