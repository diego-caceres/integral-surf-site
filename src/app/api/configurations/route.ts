import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

export interface ConfigurationItem {
  id: number;
  config_key: string;
  config_value: string | null;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("general_configurations")
      .select("*")
      .order("config_key", { ascending: true });

    if (error) {
      console.error("Supabase error fetching configurations:", error);
      return NextResponse.json(
        { error: "Failed to fetch configurations", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data as ConfigurationItem[]);
  } catch (error) {
    console.error("Unexpected error fetching configurations:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { config_key, config_value } = body;

  if (!config_key) {
    return NextResponse.json(
      { error: "config_key is required" },
      { status: 400 }
    );
  }
  // config_value can be null or an empty string, so we don't strictly validate its presence beyond type.
  if (
    typeof config_key !== "string" ||
    (typeof config_value !== "string" &&
      config_value !== null &&
      typeof config_value !== "undefined")
  ) {
    return NextResponse.json(
      { error: "Invalid data type for config_key or config_value" },
      { status: 400 }
    );
  }

  try {
    // Check if config_key already exists to prevent duplicates, as config_key should be unique
    const { data: existing, error: fetchError } = await supabaseServer
      .from("general_configurations")
      .select("config_key")
      .eq("config_key", config_key)
      .maybeSingle();

    if (fetchError) {
      console.error(
        "Supabase error checking for existing config_key:",
        fetchError
      );
      return NextResponse.json(
        {
          error: "Failed to verify config_key uniqueness",
          details: fetchError.message,
        },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: `Configuration key '${config_key}' already exists.` },
        { status: 409 } // 409 Conflict
      );
    }

    const { data, error: dbError } = await supabaseServer
      .from("general_configurations")
      .insert([
        {
          config_key,
          config_value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single(); // Assuming you want the created record back

    if (dbError) {
      console.error("Supabase error creating configuration:", dbError);
      return NextResponse.json(
        { error: "Failed to create configuration", details: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("Unexpected error creating configuration:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
