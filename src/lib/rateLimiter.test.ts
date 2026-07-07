import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { isRateLimited, recordAttempt, clearAttempts } from "./rateLimiter";

describe("rateLimiter", () => {
  const key = () => `test:${Math.random()}`;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("is not limited with no prior attempts", () => {
    const status = isRateLimited(key(), 5, 60_000);
    expect(status.limited).toBe(false);
    expect(status.retryAfterSeconds).toBe(0);
  });

  it("is not limited while under the limit", () => {
    const k = key();
    for (let i = 0; i < 4; i++) recordAttempt(k, 60_000);
    expect(isRateLimited(k, 5, 60_000).limited).toBe(false);
  });

  it("becomes limited once attempts reach the limit", () => {
    const k = key();
    for (let i = 0; i < 5; i++) recordAttempt(k, 60_000);
    const status = isRateLimited(k, 5, 60_000);
    expect(status.limited).toBe(true);
    expect(status.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("clearAttempts resets the window", () => {
    const k = key();
    for (let i = 0; i < 5; i++) recordAttempt(k, 60_000);
    expect(isRateLimited(k, 5, 60_000).limited).toBe(true);

    clearAttempts(k);
    expect(isRateLimited(k, 5, 60_000).limited).toBe(false);
  });

  it("frees the key once the window expires", () => {
    const k = key();
    for (let i = 0; i < 5; i++) recordAttempt(k, 60_000);
    expect(isRateLimited(k, 5, 60_000).limited).toBe(true);

    vi.advanceTimersByTime(60_001);
    expect(isRateLimited(k, 5, 60_000).limited).toBe(false);
  });
});
