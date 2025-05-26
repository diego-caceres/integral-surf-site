/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// GET a single trip by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure params is properly awaited if needed
    const { id } = await params;

    // Fetch the trip data
    const { data: trip, error: tripError } = await supabaseServer
      .from("trips")
      .select("*")
      .eq("id", id)
      .single();

    if (tripError) {
      return NextResponse.json({ error: tripError.message }, { status: 500 });
    }

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Fetch associated contents
    const { data: contents, error: contentsError } = await supabaseServer
      .from("trip_contents")
      .select("*")
      .eq("trip_id", id)
      .order("order", { ascending: true });

    if (contentsError) {
      return NextResponse.json(
        { error: contentsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ trip, contents });
  } catch (error) {
    console.error("Error fetching trip:", error);
    return NextResponse.json(
      { error: "Error processing request", details: String(error) },
      { status: 500 }
    );
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
      return NextResponse.json({ error: tripError.message }, { status: 500 });
    }

    // Process contents - we'll use upsert for existing contents and insert for new ones
    // First, delete any existing contents that might no longer be needed
    if (contents && contents.length > 0) {
      // Get IDs of contents that have them (existing ones)
      const contentIds = contents
        .filter((c: any) => c.id)
        .map((c: any) => c.id);

      // Delete contents not included in the updated list
      if (contentIds.length > 0) {
        await supabaseServer
          .from("trip_contents")
          .delete()
          .eq("trip_id", id)
          .not("id", "in", contentIds);
      } else {
        // If no contents have IDs, delete all existing contents for this trip
        await supabaseServer.from("trip_contents").delete().eq("trip_id", id);
      }

      // Process each content
      for (const content of contents) {
        if (content.id) {
          // Update existing content
          await supabaseServer
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
        } else {
          // Insert new content
          await supabaseServer.from("trip_contents").insert({
            trip_id: id,
            title: content.title,
            subtitle: content.subtitle || null,
            description: content.description,
            subtitle_2: content.subtitle_2 || null,
            description_2: content.description_2 || null,
            image_url: content.image_url,
          });
        }
      }
    } else {
      // If no contents provided, delete all existing contents for this trip
      await supabaseServer.from("trip_contents").delete().eq("trip_id", id);
    }

    return NextResponse.json({
      success: true,
      message: "Trip updated successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    console.error("Error updating trip:", error);
    return NextResponse.json(
      { error: "Error processing request", details: String(error) },
      { status: 500 }
    );
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!updatedTrip) {
      return NextResponse.json(
        { error: "Trip not found or could not be updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Trip marked as deleted successfully",
      trip: updatedTrip, // Return the updated trip
    });
  } catch (error) {
    console.error("Error soft deleting trip:", error); // Updated log message
    return NextResponse.json(
      { error: "Error processing request", details: String(error) },
      { status: 500 }
    );
  }
}
