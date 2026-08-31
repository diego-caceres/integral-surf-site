import { NextResponse, NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import type { HomeSection } from "@/types/homeSections";
import { revalidateHome } from "@/lib/revalidate";
import { getHomeSectionsList } from "@/lib/homeSections";
import { apiError } from "@/lib/apiError";

export async function GET() {
  try {
    const sections = await getHomeSectionsList();
    return NextResponse.json(sections);
  } catch (error) {
    return apiError("GET /api/admin/home-sections (unexpected):", error);
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
        return apiError("PUT /api/admin/home-sections (upsert):", error);
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

    revalidateHome();
    return NextResponse.json({
      success: true,
      message: "Home sections updated successfully",
    });
  } catch (error) {
    return apiError("PUT /api/admin/home-sections (unexpected):", error);
  }
}
