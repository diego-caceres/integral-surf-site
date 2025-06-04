import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers"; // cookies() from next/headers is for reading in route handlers

const ADMIN_AUTH_COOKIE_NAME = "integralsurf-admin-auth";

export async function POST(request: NextRequest) {
  try {
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

    if (username === adminUsername && password === adminPassword) {
      // Create a response object to set the cookie
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
      });

      response.cookies.set(ADMIN_AUTH_COOKIE_NAME, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/", // Cookie accessible for all paths
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // Example: 7 days expiry
      });
      return response;
    } else {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
