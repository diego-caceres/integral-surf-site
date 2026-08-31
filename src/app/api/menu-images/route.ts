import { NextResponse } from "next/server";
import { getMenuImages } from "@/lib/menuImages";
import { READ_CACHE } from "@/lib/httpCache";

export async function GET() {
  const data = await getMenuImages();
  return NextResponse.json(data, {
    headers: { "Cache-Control": READ_CACHE },
  });
}
