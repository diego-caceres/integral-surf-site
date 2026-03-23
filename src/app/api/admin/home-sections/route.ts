import { NextResponse, NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import type { HomeSection } from "@/types/homeSections";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("home_sections")
      .select("*")
      .order("section_key");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const sections = data || [];

    // Enrich sections with their slideshow images
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sections } = body as { sections: Partial<HomeSection>[] };

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    for (const section of sections) {
      const { error } = await supabaseServer
        .from("home_sections")
        .upsert(
          {
            section_key: section.section_key,
            title: section.title,
            description: section.description,
            extra_text: section.extra_text,
            button_text: section.button_text,
            image_url: section.image_url,
            image_2_url: section.image_2_url,
            video_url: section.video_url,
            background_image_url: section.background_image_url,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "section_key" }
        );

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Save slideshow images (delete-then-reinsert)
      if (section.images !== undefined && section.section_key) {
        await supabaseServer
          .from("home_section_images")
          .delete()
          .eq("section_key", section.section_key);

        if (section.images.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await supabaseServer.from("home_section_images").insert(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (section.images as any[]).map((img: any, i: number) => ({
              section_key: section.section_key,
              image_url: img.image_url,
              alt_text: img.alt_text ?? null,
              order_number: i,
            }))
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Home sections updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
