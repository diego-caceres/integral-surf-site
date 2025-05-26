import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sourceId } = await params;

    // 1. Fetch the source trip
    const { data: sourceTrip, error: sourceTripError } = await supabaseServer
      .from("trips")
      .select("*")
      .eq("id", sourceId)
      .single();

    if (sourceTripError) {
      return NextResponse.json(
        { error: sourceTripError.message },
        { status: 500 }
      );
    }

    if (!sourceTrip) {
      return NextResponse.json(
        { error: "Source trip not found" },
        { status: 404 }
      );
    }

    // 2. Fetch the trip contents
    const { data: sourceContents, error: sourceContentsError } =
      await supabaseServer
        .from("trip_contents")
        .select("*")
        .eq("trip_id", sourceId)
        .order("order", { ascending: true });

    if (sourceContentsError) {
      return NextResponse.json(
        { error: sourceContentsError.message },
        { status: 500 }
      );
    }

    // 3. Create a new ID for the cloned trip
    const newTripId = uuidv4();

    // 4. Prepare the cloned trip data (modify as needed)
    const clonedTrip = {
      ...sourceTrip,
      id: newTripId,
      title: `${sourceTrip.title} (Copia)`,
      slug: `${sourceTrip.slug}-copy-${Date.now().toString().slice(-6)}`, // Ensure unique slug
      is_deleted: false, // Ensure cloned trip is not deleted
    };

    // 5. Insert the cloned trip
    const { data: newTrip, error: newTripError } = await supabaseServer
      .from("trips")
      .insert([clonedTrip])
      .select()
      .single();

    if (newTripError) {
      return NextResponse.json(
        { error: newTripError.message },
        { status: 500 }
      );
    }

    // 6. If there are contents, clone them too
    if (sourceContents && sourceContents.length > 0) {
      const clonedContents = sourceContents.map((content) => {
        // Let Supabase generate new IDs
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...restContent } = content;
        return {
          ...restContent,
          trip_id: newTripId,
        };
      });

      const { error: contentsError } = await supabaseServer
        .from("trip_contents")
        .insert(clonedContents);

      if (contentsError) {
        // Even if contents fail to clone, we'll still return success for the trip
        console.error("Error cloning trip contents:", contentsError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Trip cloned successfully",
      trip: newTrip,
    });
  } catch (error) {
    console.error("Error cloning trip:", error);
    return NextResponse.json(
      { error: "Error processing request", details: String(error) },
      { status: 500 }
    );
  }
}
