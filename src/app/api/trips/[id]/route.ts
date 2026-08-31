/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { apiError } from "@/lib/apiError";
import { revalidateTripPages } from "@/lib/revalidate";
import { computeContentIdsToDelete, normalizeTripContents } from "@/lib/trips";

// GET a single trip by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure params is properly awaited if needed
    const { id } = await params;

    // Single round-trip: trip + its contents + each content's images,
    // instead of one query per content block plus one query per content's
    // images (the previous N+1 — for a trip with 8 content blocks this was
    // ~10 sequential Supabase requests instead of 1).
    const { data: tripData, error: tripError } = await supabaseServer
      .from("trips")
      .select("*, trip_contents(*, trip_content_images(*))")
      .eq("id", id)
      .single();

    if (tripError) {
      return apiError("GET /api/trips/[id] (trip):", tripError);
    }

    if (!tripData) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const { trip_contents, ...trip } = tripData;

    return NextResponse.json({
      trip,
      contents: normalizeTripContents(trip_contents),
    });
  } catch (error) {
    return apiError("GET /api/trips/[id] (unexpected):", error);
  }
}

// UPDATE a trip by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { trip, contents } = body;

    // Update trip data
    const { data: updatedTrip, error: tripError } = await supabaseServer
      .from("trips")
      .update(trip)
      .eq("id", id)
      .select()
      .single();

    if (tripError) {
      return apiError("PUT /api/trips/[id] (update trip):", tripError);
    }

    // Process contents - we'll use upsert for existing contents and insert for new ones
    // First, delete any existing contents that might no longer be needed
    //
    // NOTE: this whole block is NOT transactional — a failure partway through
    // (e.g. the image insert for content #2) leaves prior writes in this loop
    // committed. Full atomicity requires a Postgres RPC (see
    // claude-plans/06-atomic-writes-and-not-in-fix.md); this fix only
    // addresses the silent-failure bug (removed content blocks were never
    // actually deleted) and surfaces write errors instead of swallowing them.
    if (contents && contents.length > 0) {
      // Delete contents not included in the updated list (see
      // computeContentIdsToDelete for why this is done in JS rather than via
      // a PostgREST `.not(..., "in", ...)` filter).
      const { data: existingContents, error: existingContentsError } =
        await supabaseServer
          .from("trip_contents")
          .select("id")
          .eq("trip_id", id);

      if (existingContentsError) {
        return apiError(
          "PUT /api/trips/[id] (fetch existing contents):",
          existingContentsError
        );
      }

      const idsToDelete = computeContentIdsToDelete(
        (existingContents ?? []).map((c) => c.id as string),
        contents
      );

      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabaseServer
          .from("trip_contents")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) {
          return apiError(
            "PUT /api/trips/[id] (delete removed contents):",
            deleteError
          );
        }
      }

      // Process each content
      for (const content of contents) {
        let contentId: string | undefined;

        if (content.id) {
          // Update existing content
          const { error: updateError } = await supabaseServer
            .from("trip_contents")
            .update({
              title: content.title,
              subtitle: content.subtitle || null,
              description: content.description,
              subtitle_2: content.subtitle_2 || null,
              description_2: content.description_2 || null,
              image_url: content.image_url,
            })
            .eq("id", content.id);

          if (updateError) {
            return apiError("PUT /api/trips/[id] (update content):", updateError);
          }
          contentId = content.id;
        } else {
          // Insert new content and capture the new ID
          const { data: inserted, error: insertError } = await supabaseServer
            .from("trip_contents")
            .insert({
              trip_id: id,
              title: content.title,
              subtitle: content.subtitle || null,
              description: content.description,
              subtitle_2: content.subtitle_2 || null,
              description_2: content.description_2 || null,
              image_url: content.image_url,
            })
            .select()
            .single();

          if (insertError || !inserted) {
            return apiError(
              "PUT /api/trips/[id] (insert content):",
              insertError ?? new Error("Insert returned no row")
            );
          }
          contentId = inserted.id;
        }

        // Save images for this content (delete-then-reinsert)
        if (contentId) {
          const { error: deleteImagesError } = await supabaseServer
            .from("trip_content_images")
            .delete()
            .eq("trip_content_id", contentId);

          if (deleteImagesError) {
            return apiError(
              "PUT /api/trips/[id] (delete content images):",
              deleteImagesError
            );
          }

          if (content.images && content.images.length > 0) {
            const { error: insertImagesError } = await supabaseServer
              .from("trip_content_images")
              .insert(
                content.images.map((img: any, i: number) => ({
                  trip_content_id: contentId,
                  image_url: img.image_url,
                  alt_text: img.alt_text ?? null,
                  order_number: i,
                }))
              );

            if (insertImagesError) {
              return apiError(
                "PUT /api/trips/[id] (insert content images):",
                insertImagesError
              );
            }
          }
        }
      }
    } else {
      // If no contents provided, delete all existing contents for this trip
      const { error: deleteAllError } = await supabaseServer
        .from("trip_contents")
        .delete()
        .eq("trip_id", id);

      if (deleteAllError) {
        return apiError(
          "PUT /api/trips/[id] (delete all contents):",
          deleteAllError
        );
      }
    }

    revalidateTripPages();
    return NextResponse.json({
      success: true,
      message: "Trip updated successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    return apiError("PUT /api/trips/[id] (unexpected):", error);
  }
}

// DELETE a trip by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Do NOT delete associated contents for a soft delete
    // await supabaseServer.from("trip_contents").delete().eq("trip_id", id);

    // Update the trip to mark it as deleted
    const { data: updatedTrip, error } = await supabaseServer
      .from("trips")
      .update({ is_deleted: true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return apiError("DELETE /api/trips/[id]:", error);
    }

    if (!updatedTrip) {
      return NextResponse.json(
        { error: "Trip not found or could not be updated" },
        { status: 404 }
      );
    }

    revalidateTripPages();
    return NextResponse.json({
      success: true,
      message: "Trip marked as deleted successfully",
      trip: updatedTrip, // Return the updated trip
    });
  } catch (error) {
    return apiError("DELETE /api/trips/[id] (unexpected):", error);
  }
}
