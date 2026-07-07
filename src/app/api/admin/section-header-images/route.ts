import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { revalidateHome } from "@/lib/revalidate";
import { getSectionHeaderImages } from "@/lib/sectionHeaderImages";
import { apiError } from "@/lib/apiError";

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
    const images = await getSectionHeaderImages(true);
    return NextResponse.json(images);
  } catch (err) {
    return apiError("GET /api/admin/section-header-images (unexpected):", err);
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
        throw insertError;
      }
    }

    revalidateHome();
    return NextResponse.json({
      message: "Section header images updated successfully.",
    });
  } catch (err) {
    return apiError("PUT /api/admin/section-header-images:", err);
  }
}
