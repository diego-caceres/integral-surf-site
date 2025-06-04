import { NextRequest, NextResponse } from "next/server";

const ADMIN_AUTH_COOKIE_NAME = "integralsurf-admin-auth";

export async function POST(_request: NextRequest) {
  try {
    // Trivial usage of _request to satisfy the linter
    const method = _request.method;
    if (process.env.NODE_ENV === "development") {
      console.log(`Admin logout request received with method: ${method}`);
    }

    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    // Clear the authentication cookie
    response.cookies.set(ADMIN_AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: -1, // Instructs the browser to delete the cookie immediately
    });
    // Or alternatively, and often preferred:
    // response.cookies.delete(ADMIN_AUTH_COOKIE_NAME, {
    //   path: '/',
    // });

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during logout." },
      { status: 500 }
    );
  }
}
