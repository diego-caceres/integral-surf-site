import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("home_sections")
      .select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const sections = data || [];

    // Enrich sections that have a slideshow with their images
    const enriched = await Promise.all(
      sections.map(async (section) => {
        const { data: images } = await supabaseServer
          .from("home_section_images")
          .select("*")
          .eq("section_key", section.section_key)
          .order("order_number", { ascending: true });
        return { ...section, images: images || [] };
      })
    );

    return NextResponse.json(enriched);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
