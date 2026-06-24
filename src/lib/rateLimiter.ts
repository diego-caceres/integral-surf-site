/**
 * Minimal fixed-window rate limiter backed by an in-process Map.
 *
 * Caveat: state lives in the lambda's memory, so on serverless it is
 * best-effort — it resets on cold starts and is not shared across concurrent
 * instances. It still meaningfully raises the bar against password
 * brute-forcing from a single source. For a hard global limit, back this with
 * a shared store (Upstash/Vercel KV) instead.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

/** Drop expired buckets periodically so the Map can't grow unbounded. */
function sweep(now: number): void {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitStatus {
  limited: boolean;
  retryAfterSeconds: number;
}

/** Reports whether `key` has already reached `limit` within the current window. */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
): RateLimitStatus {
  const now = Date.now();
  sweep(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    return { limited: false, retryAfterSeconds: 0 };
  }
  return {
    limited: bucket.count >= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

/** Records one attempt against `key`, starting a new window if needed. */
export function recordAttempt(key: string, windowMs: number): void {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
}

/** Clears the window for `key` (e.g. after a successful login). */
export function clearAttempts(key: string): void {
  buckets.delete(key);
}
