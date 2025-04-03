// File: pages/api/trips/[slug].ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { Trip } from "@/types/trip";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Ensure params is properly awaited if needed
    const { slug } = await params;

    if (!slug || Array.isArray(slug)) {
      return NextResponse.json(
        { error: "Invalid slug parameter" },
        { status: 400 }
      );
    }

    // Fetch the trip based on slug
    const { data: tripData, error: tripError } = await supabaseServer
      .from("trips")
      .select("*")
      .eq("slug", slug)
      .single();

    if (tripError) throw tripError;
    if (!tripData)
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    // Fetch the trip contents
    const { data: contentData, error: contentError } = await supabaseServer
      .from("trip_contents")
      .select("*")
      .eq("trip_id", tripData.id)
      .order("order", { ascending: true });

    if (contentError) throw contentError;

    // Combine trip with its contents
    const fullTrip: Trip = {
      ...tripData,
      trip_contents: contentData || [],
    };

    return NextResponse.json(fullTrip);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load trip data",
      },
      { status: 500 }
    );
  }
}
