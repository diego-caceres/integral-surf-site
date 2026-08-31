import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { revalidateTripPages } from "@/lib/revalidate";
import { apiError } from "@/lib/apiError";

export async function POST(
  request: NextRequest, // Added request parameter, even if not used, to match convention
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: restoredTrip, error } = await supabaseServer
      .from("trips")
      .update({ is_deleted: false })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return apiError("POST /api/trips/[id]/restore:", error);
    }

    if (!restoredTrip) {
      return NextResponse.json(
        { error: "Trip not found or could not be restored" },
        { status: 404 }
      );
    }

    revalidateTripPages();
    return NextResponse.json({
      success: true,
      message: "Trip restored successfully",
      trip: restoredTrip,
    });
  } catch (error) {
    return apiError("POST /api/trips/[id]/restore (unexpected):", error);
  }
}
