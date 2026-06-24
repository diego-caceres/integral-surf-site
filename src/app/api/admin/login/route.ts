import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_AUTH_COOKIE_NAME,
  createSessionToken,
  safeEqual,
  SESSION_TTL_MS,
} from "@/lib/auth";
import {
  clearAttempts,
  isRateLimited,
  recordAttempt,
} from "@/lib/rateLimiter";

// Throttle brute-force attempts: max failures per IP within the window.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const rateKey = `login:${getClientIp(request)}`;

    // Block before doing any credential work once the limit is reached.
    const { limited, retryAfterSeconds } = isRateLimited(
      rateKey,
      MAX_ATTEMPTS,
      WINDOW_MS
    );
    if (limited) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error("Admin credentials are not set in environment variables.");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    // Compare both fields unconditionally (no short-circuit) and in constant
    // time so a wrong username can't be distinguished from a wrong password.
    const userOk = await safeEqual(String(username ?? ""), adminUsername);
    const passOk = await safeEqual(String(password ?? ""), adminPassword);

    if (userOk && passOk) {
      clearAttempts(rateKey); // reset the window on success

      const response = NextResponse.json({
        success: true,
        message: "Login successful",
      });

      // Signed, expiring session token — not a guessable static value.
      response.cookies.set(ADMIN_AUTH_COOKIE_NAME, await createSessionToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/", // Cookie accessible for all paths
        sameSite: "lax",
        maxAge: Math.floor(SESSION_TTL_MS / 1000),
      });
      return response;
    }

    recordAttempt(rateKey, WINDOW_MS);
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
