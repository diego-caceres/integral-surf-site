import { NextResponse } from "next/server";
// import { supabase } from "@/lib/supabaseClient"; // Old client
import { supabaseServer } from "@/lib/supabaseServer"; // Use server client

// Type for the objects in the arrays that will be sent to the client
interface ClientImage {
  image_url: string;
  alt_text: string | null;
}

// Type for the raw data fetched from Supabase
interface DBImage extends ClientImage {
  device_type: "web" | "mobile";
  // display_order is used for sorting but not directly part of this type after select
}

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("section_header_images")
      .select("image_url, alt_text, device_type") // Select necessary fields
      .order("device_type", { ascending: true }) // Order by device_type first
      .order("display_order", { ascending: true }); // Then by display_order within each device_type

    if (error) {
      console.error("Error fetching section header images:", error);
      return NextResponse.json(
        { error: "Failed to fetch images", details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      // Should ideally not happen if error is not set, but good for type safety
      return NextResponse.json({ web: [], mobile: [] });
    }

    // Explicitly cast the fetched data to our DBImage type array
    const imagesFromDB = data as DBImage[];

    const webImages: ClientImage[] = imagesFromDB
      .filter((img) => img.device_type === "web")
      .map(({ image_url, alt_text }) => ({ image_url, alt_text }));

    const mobileImages: ClientImage[] = imagesFromDB
      .filter((img) => img.device_type === "mobile")
      .map(({ image_url, alt_text }) => ({ image_url, alt_text }));

    return NextResponse.json({ web: webImages, mobile: mobileImages });
  } catch (err) {
    console.error("Unexpected error in GET /api/section-header-images:", err);
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: "An unexpected error occurred", details: errorMessage },
      { status: 500 }
    );
  }
}
