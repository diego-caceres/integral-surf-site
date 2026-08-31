import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { apiError } from "@/lib/apiError";
import { isAuthenticatedRequest } from "@/lib/auth";

// Admin trip listing — unlike the public GET /api/trips, this includes
// soft-deleted trips (the admin UI has a "Mostrar Eliminados" toggle) and is
// never CDN-cached. Enforced centrally in middleware.ts; checked again here
// as defense in depth, consistent with the other /api/admin/* routes.
export async function GET(request: NextRequest) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseServer
      .from("trips")
      .select(
        "id, slug, title, title_2, destiny, coaching_subtitle, date_month, date_days, date_month_2, date_days_2, order, is_deleted"
      )
      .order("order", { ascending: true });

    if (error) {
      return apiError("GET /api/admin/trips:", error);
    }

    return NextResponse.json(data);
  } catch (error) {
    return apiError("GET /api/admin/trips (unexpected):", error);
  }
}
