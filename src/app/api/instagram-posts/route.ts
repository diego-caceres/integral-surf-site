import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";
import { READ_CACHE } from "@/lib/httpCache";
import { apiError } from "@/lib/apiError";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("instagram_posts")
      .select("*")
      .order("order_number", { ascending: true });

    if (error) {
      return apiError("GET /api/instagram-posts:", error);
    }

    return NextResponse.json(data, { headers: { "Cache-Control": READ_CACHE } });
  } catch (error) {
    return apiError("GET /api/instagram-posts (unexpected):", error);
  }
}
