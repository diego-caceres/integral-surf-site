import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!restoredTrip) {
      return NextResponse.json(
        { error: "Trip not found or could not be restored" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Trip restored successfully",
      trip: restoredTrip,
    });
  } catch (error) {
    console.error("Error restoring trip:", error);
    return NextResponse.json(
      { error: "Error processing request", details: String(error) },
      { status: 500 }
    );
  }
}
