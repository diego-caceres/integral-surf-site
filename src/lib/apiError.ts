import { NextResponse } from "next/server";
import { isSupabaseAuthError, SUPABASE_KEY_HINT } from "./supabaseError";

/**
 * Logs the real error server-side and returns a generic client response.
 * Avoids leaking database/schema details (Supabase error messages, stack
 * traces) to callers.
 *
 * A rejected Supabase key is treated as an infrastructure outage: it gets a
 * loud, actionable log and a 503 so it's never mistaken for a client error.
 */
export function apiError(
  context: string,
  error: unknown,
  status = 500,
  clientMessage = "Internal Server Error"
) {
  if (isSupabaseAuthError(error)) {
    console.error(context, SUPABASE_KEY_HINT, error);
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 }
    );
  }

  console.error(context, error);
  return NextResponse.json({ error: clientMessage }, { status });
}
