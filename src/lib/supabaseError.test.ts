import { describe, it, expect } from "vitest";
import { isSupabaseAuthError } from "./supabaseError";

describe("isSupabaseAuthError", () => {
  it("flags a 401 status", () => {
    expect(isSupabaseAuthError({ status: 401 })).toBe(true);
  });

  it("flags messages mentioning API key issues", () => {
    expect(isSupabaseAuthError({ message: "Invalid API key" })).toBe(true);
    expect(isSupabaseAuthError({ message: "No API key found in request" })).toBe(true);
  });

  it("flags JWT-related errors", () => {
    expect(isSupabaseAuthError({ message: "JWT expired" })).toBe(true);
  });

  it("flags unauthorized errors", () => {
    expect(isSupabaseAuthError({ hint: "unauthorized access" })).toBe(true);
  });

  it("does not flag a normal not-found error", () => {
    expect(isSupabaseAuthError({ code: "PGRST116", message: "no rows found" })).toBe(false);
  });

  it("handles null/non-object input safely", () => {
    expect(isSupabaseAuthError(null)).toBe(false);
    expect(isSupabaseAuthError(undefined)).toBe(false);
    expect(isSupabaseAuthError("some string error")).toBe(false);
  });
});
