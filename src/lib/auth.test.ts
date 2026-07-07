import { describe, it, expect, vi, afterEach } from "vitest";
import { createSessionToken, verifySessionToken } from "./auth";

describe("createSessionToken / verifySessionToken", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("round-trips: a freshly created token verifies true", async () => {
    const token = await createSessionToken();
    expect(await verifySessionToken(token)).toBe(true);
  });

  it("rejects a tampered signature", async () => {
    const token = await createSessionToken();
    const [payload, signature] = token.split(".");
    const tamperedSig = signature.slice(0, -1) + (signature.at(-1) === "A" ? "B" : "A");
    expect(await verifySessionToken(`${payload}.${tamperedSig}`)).toBe(false);
  });

  it("rejects a tampered payload", async () => {
    const token = await createSessionToken();
    const [, signature] = token.split(".");
    const forgedPayload = Buffer.from(JSON.stringify({ exp: Date.now() + 999999 }))
      .toString("base64url");
    expect(await verifySessionToken(`${forgedPayload}.${signature}`)).toBe(false);
  });

  it("rejects an expired token", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const token = await createSessionToken();

    vi.setSystemTime(new Date("2026-01-15T00:00:00Z")); // past the 7-day TTL
    expect(await verifySessionToken(token)).toBe(false);
  });

  it("rejects malformed tokens", async () => {
    expect(await verifySessionToken(undefined)).toBe(false);
    expect(await verifySessionToken(null)).toBe(false);
    expect(await verifySessionToken("")).toBe(false);
    expect(await verifySessionToken("not-a-valid-token")).toBe(false);
    expect(await verifySessionToken("a.b.c")).toBe(false);
  });
});
