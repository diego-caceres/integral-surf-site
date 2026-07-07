import { NextResponse } from "next/server";
import { getHomeSectionsList } from "@/lib/homeSections";
import { READ_CACHE } from "@/lib/httpCache";
import { apiError } from "@/lib/apiError";

export async function GET() {
  try {
    const sections = await getHomeSectionsList();
    return NextResponse.json(sections, {
      headers: { "Cache-Control": READ_CACHE },
    });
  } catch (error) {
    return apiError("GET /api/home-sections (unexpected):", error);
  }
}
