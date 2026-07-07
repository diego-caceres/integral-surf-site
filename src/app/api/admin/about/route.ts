import { NextResponse, NextRequest } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";
import { isAuthenticatedRequest } from "@/lib/auth";
import { revalidateAbout } from "@/lib/revalidate";
import { getAboutPage } from "@/lib/about";
import { apiError } from "@/lib/apiError";

// Enforced centrally in middleware.ts; checked again here as defense in depth.
async function isAdmin(request: NextRequest): Promise<boolean> {
  return isAuthenticatedRequest(request);
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const aboutData = await getAboutPage();

    if (!aboutData) {
      return NextResponse.json(
        { error: "About page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(aboutData);
  } catch (error) {
    return apiError("GET /api/admin/about (unexpected):", error);
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { hero_title, hero_description_1, hero_description_2, instructors } =
      body;

    // Validate required fields
    if (!hero_title || !hero_description_1 || !hero_description_2) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: hero_title, hero_description_1, hero_description_2",
        },
        { status: 400 }
      );
    }

    // First, get the existing about page to get its ID
    const { data: existingAbout, error: fetchError } = await supabaseServer
      .from("about_page")
      .select("id")
      .single();

    if (fetchError) {
      return apiError("PUT /api/admin/about (fetch existing):", fetchError);
    }

    if (!existingAbout) {
      return NextResponse.json(
        { error: "About page not found" },
        { status: 404 }
      );
    }

    // Update the main about page content
    const { data: updatedAbout, error: aboutError } = await supabaseServer
      .from("about_page")
      .update({
        hero_title,
        hero_description_1,
        hero_description_2,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingAbout.id)
      .select()
      .single();

    if (aboutError) {
      return apiError("PUT /api/admin/about (update):", aboutError);
    }

    // Update instructors if provided
    if (instructors && Array.isArray(instructors)) {
      // Delete existing instructors
      const { error: deleteError } = await supabaseServer
        .from("about_instructors")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all trick

      if (deleteError) {
        return apiError("PUT /api/admin/about (delete instructors):", deleteError);
      }

      // Insert new instructors
      if (instructors.length > 0) {
        const instructorsToInsert = instructors.map(
          (instructor: {
            name: string;
            description: string;
            image_url: string;
            order_number: number;
          }) => ({
            name: instructor.name,
            description: instructor.description,
            image_url: instructor.image_url,
            order_number: instructor.order_number,
          })
        );

        const { error: insertError } = await supabaseServer
          .from("about_instructors")
          .insert(instructorsToInsert);

        if (insertError) {
          return apiError("PUT /api/admin/about (insert instructors):", insertError);
        }
      }
    }

    revalidateAbout();
    return NextResponse.json({
      success: true,
      message: "About page updated successfully",
      data: updatedAbout,
    });
  } catch (error) {
    return apiError("PUT /api/admin/about (unexpected):", error);
  }
}
