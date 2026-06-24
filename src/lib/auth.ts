import type { NextRequest } from "next/server";

/**
 * Admin session handling.
 *
 * The admin cookie holds an HMAC-signed, expiring token — NOT a static value.
 * A forged cookie cannot be created without the server secret. Everything here
 * relies only on Web Crypto + btoa/atob so it runs in both the Edge runtime
 * (middleware) and the Node runtime (route handlers, server components).
 */

export const ADMIN_AUTH_COOKIE_NAME = "integralsurf-admin-auth";

/** Session lifetime. Keep in sync with the cookie maxAge set on login. */
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  // Dedicated secret preferred; fall back to ADMIN_PASSWORD so existing
  // deployments keep working until ADMIN_SESSION_SECRET is configured.
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET (or ADMIN_PASSWORD) must be set to sign admin sessions."
    );
  }
  return secret;
}

function toBase64Url(input: ArrayBuffer | Uint8Array): string {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  let normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  while (normalized.length % 4) normalized += "=";
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toBase64Url(signature);
}

/** Constant-time string comparison to avoid signature timing leaks. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

/** Builds a fresh signed session token. Set this as the cookie value on login. */
export async function createSessionToken(): Promise<string> {
  const payload = toBase64Url(
    new TextEncoder().encode(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS }))
  );
  const signature = await hmac(payload);
  return `${payload}.${signature}`;
}

/** Verifies the signature and expiry of a session token. */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;

  const expected = await hmac(payload);
  if (!timingSafeEqual(signature, expected)) return false;

  try {
    const decoded = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    return typeof decoded.exp === "number" && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

/** Convenience check for route handlers that receive a NextRequest. */
export async function isAuthenticatedRequest(
  request: NextRequest
): Promise<boolean> {
  return verifySessionToken(request.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value);
}
