import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { AboutPage } from "@/types/about";

export async function GET() {
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
    console.error("Unexpected error in GET /api/about:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
