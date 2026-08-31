import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { revalidateTripPages } from "@/lib/revalidate";
import { normalizeTripContents } from "@/lib/trips";
import { apiError } from "@/lib/apiError";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sourceId } = await params;

    // 1 & 2. Fetch the source trip, its contents, and each content's images
    // in a single round-trip (previously 1 query for the trip + 1 for its
    // contents + 1 per content for images — the same N+1 pattern fixed
    // elsewhere in src/lib/trips.ts#getTripBySlug).
    const { data: sourceTripData, error: sourceTripError } =
      await supabaseServer
        .from("trips")
        .select("*, trip_contents(*, trip_content_images(*))")
        .eq("id", sourceId)
        .single();

    if (sourceTripError) {
      return apiError("POST /api/trips/[id]/clone (fetch source):", sourceTripError);
    }

    if (!sourceTripData) {
      return NextResponse.json(
        { error: "Source trip not found" },
        { status: 404 }
      );
    }

    const { trip_contents, ...sourceTrip } = sourceTripData;
    const sourceContents = normalizeTripContents(trip_contents);

    // 3. Create a new ID for the cloned trip
    const newTripId = crypto.randomUUID();

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
      return apiError("POST /api/trips/[id]/clone (insert new trip):", newTripError);
    }

    // 6. If there are contents, clone them too (one at a time to capture new
    // IDs for image cloning). Each content's images were already fetched in
    // the single nested-select query above, so this loop no longer re-queries
    // trip_content_images per content.
    if (sourceContents && sourceContents.length > 0) {
      for (const content of sourceContents) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: sourceContentId, images: sourceImages, ...restContent } = content;

        const { data: newContent, error: contentError } = await supabaseServer
          .from("trip_contents")
          .insert({ ...restContent, trip_id: newTripId })
          .select()
          .single();

        if (contentError) {
          console.error("Error cloning trip content:", contentError);
          continue;
        }

        if (sourceImages && sourceImages.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const imagesToInsert = sourceImages.map(({ id, ...rest }) => ({
            ...rest,
            trip_content_id: newContent.id,
          }));
          await supabaseServer.from("trip_content_images").insert(imagesToInsert);
        }
      }
    }

    revalidateTripPages();
    return NextResponse.json({
      success: true,
      message: "Trip cloned successfully",
      trip: newTrip,
    });
  } catch (error) {
    return apiError("POST /api/trips/[id]/clone (unexpected):", error);
  }
}
