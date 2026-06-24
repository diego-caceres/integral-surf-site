import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

// Fail fast with a clear message instead of letting `undefined` reach the
// client and surface as cryptic runtime errors on the first query.
if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error(
    "Supabase is not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE in your environment."
  );
}

// Legacy `service_role` JWTs (eyJ...) are being phased out for sb_secret_ keys.
// Warn in development so a disabled legacy key is obvious to diagnose locally.
if (
  process.env.NODE_ENV !== "production" &&
  supabaseServiceRole.startsWith("eyJ")
) {
  console.warn(
    "[supabase] SUPABASE_SERVICE_ROLE looks like a legacy JWT key (eyJ...). " +
      "If legacy keys are disabled in Supabase, replace it with the new sb_secret_ key."
  );
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRole, {
  auth: { persistSession: false }, // No queremos sesiones en el backend
});
