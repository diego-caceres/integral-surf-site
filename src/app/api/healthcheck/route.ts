import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const { error } = await supabaseServer
    .from("general_configurations")
    .select("id")
    .limit(1);

  if (error) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 503 }
    );
  }

  return NextResponse.json({ status: "ok" });
}
