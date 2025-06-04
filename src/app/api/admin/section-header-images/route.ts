import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

interface SectionHeaderImageFromDB {
  id: string; // Assuming UUIDs are strings here
  image_url: string;
  alt_text: string | null;
  device_type: "web" | "mobile";
  display_order: number;
}

interface ImageToSaveClient {
  image_url: string;
  alt_text: string | null;
  // id might not be needed from client if we replace all, but useful if existing
  id?: string; // Optional: for potential future use if we want to preserve IDs
}

interface UpdatePayload {
  web: ImageToSaveClient[];
  mobile: ImageToSaveClient[];
}

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("section_header_images")
      .select("id, image_url, alt_text, device_type, display_order")
      .order("device_type", { ascending: true })
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching section header images for admin:", error);
      throw error; // Propagate error to be caught by catch block
    }

    const webImages = (data as SectionHeaderImageFromDB[])
      .filter((img) => img.device_type === "web")
      .map(({ id, image_url, alt_text, display_order }) => ({
        id,
        image_url,
        alt_text,
        display_order,
      }));
    const mobileImages = (data as SectionHeaderImageFromDB[])
      .filter((img) => img.device_type === "mobile")
      .map(({ id, image_url, alt_text, display_order }) => ({
        id,
        image_url,
        alt_text,
        display_order,
      }));

    return NextResponse.json({ web: webImages, mobile: mobileImages });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unknown error occurred";
    console.error("GET /api/admin/section-header-images error:", message);
    return NextResponse.json(
      { error: "Failed to fetch section header images", details: message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as UpdatePayload;
    const { web: webImagesToSave, mobile: mobileImagesToSave } = body;

    if (!webImagesToSave || !mobileImagesToSave) {
      return NextResponse.json(
        {
          error:
            "Invalid payload structure. 'web' and 'mobile' arrays are required.",
        },
        { status: 400 }
      );
    }

    // Use Supabase function to perform transaction if possible, or handle sequentially
    // For simplicity, we'll delete all and then insert.
    // Consider a more robust transaction for production.

    const { error: deleteError } = await supabaseServer
      .from("section_header_images")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all rows trick if no specific condition

    if (deleteError) {
      console.error("Error deleting old section header images:", deleteError);
      throw deleteError;
    }

    const imagesToInsert: Omit<
      SectionHeaderImageFromDB,
      "id" | "created_at"
    >[] = [];

    webImagesToSave.forEach((img, index) => {
      if (img.image_url) {
        // Only insert if URL is present
        imagesToInsert.push({
          image_url: img.image_url,
          alt_text: img.alt_text,
          device_type: "web",
          display_order: index + 1,
        });
      }
    });

    mobileImagesToSave.forEach((img, index) => {
      if (img.image_url) {
        // Only insert if URL is present
        imagesToInsert.push({
          image_url: img.image_url,
          alt_text: img.alt_text,
          device_type: "mobile",
          display_order: index + 1,
        });
      }
    });

    if (imagesToInsert.length > 0) {
      const { error: insertError } = await supabaseServer
        .from("section_header_images")
        .insert(imagesToInsert);

      if (insertError) {
        console.error(
          "Error inserting new section header images:",
          insertError
        );
        throw insertError;
      }
    }

    return NextResponse.json({
      message: "Section header images updated successfully.",
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unknown error occurred";
    console.error("PUT /api/admin/section-header-images error:", message);
    return NextResponse.json(
      { error: "Failed to update section header images", details: message },
      { status: 500 }
    );
  }
}
