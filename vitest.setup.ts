import "@testing-library/jest-dom/vitest";

// Pure-function/lib tests run in the Node/jsdom test environment, not through
// Next's env loading, so secrets used by src/lib/auth.ts must be set here.
process.env.ADMIN_SESSION_SECRET ??= "test-secret-do-not-use-in-prod";

// src/lib/supabaseServer.ts throws at import time if these are unset, which
// would otherwise break any test that transitively imports src/lib/trips.ts
// (even tests that only exercise pure functions and never touch the network).
process.env.SUPABASE_URL ??= "https://test-project.supabase.co";
process.env.SUPABASE_SERVICE_ROLE ??= "test-service-role-key";
