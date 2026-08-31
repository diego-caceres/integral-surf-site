import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";
import { isAuthenticatedRequest } from "@/lib/auth";
import { apiError } from "@/lib/apiError";

export interface ConfigurationItem {
  id: number;
  config_key: string;
  config_value: string | null;
  created_at: string;
  updated_at: string;
}

// Enforced centrally in middleware.ts (ALWAYS_PROTECTED); checked again here
// as defense in depth. This endpoint lists/creates every config key and is
// only ever called from the admin configurations page — it must never be
// reachable anonymously (a prior middleware matcher gap left it open).
async function isAdmin(request: NextRequest): Promise<boolean> {
  return isAuthenticatedRequest(request);
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseServer
      .from("general_configurations")
      .select("*")
      .order("config_key", { ascending: true });

    if (error) {
      return apiError("GET /api/configurations:", error);
    }

    return NextResponse.json(data as ConfigurationItem[]);
  } catch (error) {
    return apiError("GET /api/configurations (unexpected):", error);
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
      return apiError("POST /api/configurations (uniqueness check):", fetchError);
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
      return apiError("POST /api/configurations (insert):", dbError);
    }

    return NextResponse.json(data, { status: 201 }); // 201 Created
  } catch (error) {
    return apiError("POST /api/configurations (unexpected):", error);
  }
}
