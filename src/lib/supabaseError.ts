/**
 * Detects Supabase responses caused by a missing, invalid, or disabled API key
 * (e.g. a legacy `service_role` JWT after legacy keys are turned off). These
 * are configuration/infrastructure failures, not normal "no rows" errors, and
 * deserve a distinct, actionable log instead of a generic 500.
 */
export function isSupabaseAuthError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as {
    message?: string;
    hint?: string;
    code?: string;
    status?: number;
  };

  if (e.status === 401) return true;

  const haystack = `${e.message ?? ""} ${e.hint ?? ""} ${e.code ?? ""}`.toLowerCase();
  // "api key" covers: invalid / missing / no / legacy (disabled) API key messages.
  return (
    haystack.includes("api key") ||
    haystack.includes("jwt") ||
    haystack.includes("unauthorized")
  );
}

export const SUPABASE_KEY_HINT =
  "[supabase] Request rejected — check SUPABASE_SERVICE_ROLE. A legacy JWT key " +
  "(eyJ...) stops working once legacy keys are disabled in Supabase; use the new " +
  "sb_secret_ key.";
