import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer"; // Using Supabase client

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  const { key } = params;

  if (!key) {
    return NextResponse.json(
      { error: "Configuration key is required" },
      { status: 400 }
    );
  }

  try {
    const { data, error: dbError } = await supabaseServer
      .from("general_configurations")
      .select("config_value")
      .eq("config_key", key)
      .single(); // Use .single() if the key is unique and you expect one or zero rows

    if (dbError) {
      console.error("Supabase error fetching configuration:", dbError);
      // Check for specific errors, e.g., PostgREST error P0002 (row_not_found for .single())
      if (dbError.code === "PGRST116") {
        // PGRST116 often means no rows found for .single() or .maybeSingle()
        return NextResponse.json(
          { error: "Configuration not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Failed to fetch configuration", details: dbError.message },
        { status: 500 }
      );
    }

    if (!data) {
      // This case might also be covered by dbError.code PGRST116 with .single()
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ value: data.config_value });
  } catch (error) {
    // Catch any other unexpected errors
    console.error("Unexpected error fetching configuration:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { key: string } }
) {
  const { key } = params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { config_value } = body;

  if (!key) {
    return NextResponse.json(
      { error: "Configuration key is required" },
      { status: 400 }
    );
  }

  if (typeof config_value === "undefined") {
    return NextResponse.json(
      { error: "config_value is required in the body" },
      { status: 400 }
    );
  }

  try {
    const { data, error: dbError } = await supabaseServer
      .from("general_configurations")
      .update({
        config_value: config_value,
        updated_at: new Date().toISOString(),
      })
      .eq("config_key", key)
      .select()
      .single();

    if (dbError) {
      console.error("Supabase error updating configuration:", dbError);
      if (dbError.code === "PGRST116") {
        // No row found to update
        return NextResponse.json(
          { error: "Configuration not found to update" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Failed to update configuration", details: dbError.message },
        { status: 500 }
      );
    }

    if (!data) {
      // Should be caught by PGRST116, but as a fallback
      return NextResponse.json(
        { error: "Configuration not found after update attempt" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error updating configuration:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { key: string } }
) {
  const { key } = params;

  if (!key) {
    return NextResponse.json(
      { error: "Configuration key is required" },
      { status: 400 }
    );
  }

  try {
    // Check if the item exists before deleting
    const { data: existingData, error: fetchError } = await supabaseServer
      .from("general_configurations")
      .select("id")
      .eq("config_key", key)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is not an error if item doesn't exist for maybeSingle
      console.error("Supabase error fetching before delete:", fetchError);
      return NextResponse.json(
        {
          error: "Failed to verify configuration before deletion",
          details: fetchError.message,
        },
        { status: 500 }
      );
    }

    if (!existingData && !fetchError) {
      // No item found
      return NextResponse.json(
        { error: "Configuration not found to delete" },
        { status: 404 }
      );
    }

    const { error: dbError } = await supabaseServer
      .from("general_configurations")
      .delete()
      .eq("config_key", key);

    if (dbError) {
      console.error("Supabase error deleting configuration:", dbError);
      return NextResponse.json(
        { error: "Failed to delete configuration", details: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Configuration deleted successfully" });
  } catch (error) {
    console.error("Unexpected error deleting configuration:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
