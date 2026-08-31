import { NextResponse } from "next/server";
import { getSectionHeaderImages } from "@/lib/sectionHeaderImages";
import { READ_CACHE } from "@/lib/httpCache";
import { apiError } from "@/lib/apiError";

export async function GET() {
  try {
    const images = await getSectionHeaderImages();
    return NextResponse.json(images, {
      headers: { "Cache-Control": READ_CACHE },
    });
  } catch (err) {
    return apiError("GET /api/section-header-images (unexpected):", err);
  }
}
