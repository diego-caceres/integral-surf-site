import { NextResponse, NextRequest } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";
import type { AboutPage } from "@/types/about";

// IMPORTANT: Protect this route! Ensure only admins can call it.
async function isAdmin(_request: NextRequest): Promise<boolean> {
  // TODO: Implement proper admin authentication
  console.warn(
    "TODO: Implement proper admin authentication for /api/admin/about. Placeholder usage of _request.url:",
    _request.url
  );
  return true;
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    // Fetch the main about page content
    const { data: aboutData, error: aboutError } = await supabaseServer
      .from("about_page")
      .select("*")
      .single();

    if (aboutError) {
      console.error("Error fetching about page:", aboutError);
      return NextResponse.json(
        { error: "Failed to fetch about page", details: aboutError.message },
        { status: 500 }
      );
    }

    if (!aboutData) {
      return NextResponse.json(
        { error: "About page not found" },
        { status: 404 }
      );
    }

    // Fetch the instructors
    const { data: instructorsData, error: instructorsError } =
      await supabaseServer
        .from("about_instructors")
        .select("*")
        .order("order_number", { ascending: true });

    if (instructorsError) {
      console.error("Error fetching instructors:", instructorsError);
      return NextResponse.json(
        {
          error: "Failed to fetch instructors",
          details: instructorsError.message,
        },
        { status: 500 }
      );
    }

    // Combine the data
    const fullAboutPage: AboutPage = {
      ...aboutData,
      instructors: instructorsData || [],
    };

    return NextResponse.json(fullAboutPage);
  } catch (error) {
    console.error("Unexpected error in GET /api/admin/about:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
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
      console.error("Error fetching about page:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch about page", details: fetchError.message },
        { status: 500 }
      );
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
      console.error("Error updating about page:", aboutError);
      return NextResponse.json(
        { error: "Failed to update about page", details: aboutError.message },
        { status: 500 }
      );
    }

    // Update instructors if provided
    if (instructors && Array.isArray(instructors)) {
      // Delete existing instructors
      const { error: deleteError } = await supabaseServer
        .from("about_instructors")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all trick

      if (deleteError) {
        console.error("Error deleting instructors:", deleteError);
        return NextResponse.json(
          {
            error: "Failed to delete instructors",
            details: deleteError.message,
          },
          { status: 500 }
        );
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
          console.error("Error inserting instructors:", insertError);
          return NextResponse.json(
            {
              error: "Failed to insert instructors",
              details: insertError.message,
            },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "About page updated successfully",
      data: updatedAbout,
    });
  } catch (error) {
    console.error("Unexpected error in PUT /api/admin/about:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
