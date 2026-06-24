import { NextResponse } from "next/server";

/**
 * Logs the real error server-side and returns a generic client response.
 * Avoids leaking database/schema details (Supabase error messages, stack
 * traces) to callers.
 */
export function apiError(
  context: string,
  error: unknown,
  status = 500,
  clientMessage = "Internal Server Error"
) {
  console.error(context, error);
  return NextResponse.json({ error: clientMessage }, { status });
}
