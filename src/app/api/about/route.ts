import { NextResponse } from "next/server";
import { getAboutPage } from "@/lib/about";
import { READ_CACHE } from "@/lib/httpCache";
import { apiError } from "@/lib/apiError";

export async function GET() {
  try {
    const aboutData = await getAboutPage();

    if (!aboutData) {
      return NextResponse.json(
        { error: "About page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(aboutData, {
      headers: { "Cache-Control": READ_CACHE },
    });
  } catch (error) {
    return apiError("GET /api/about (unexpected):", error);
  }
}
