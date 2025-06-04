import { NextResponse, NextRequest } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer"; // Adjusted path

interface MenuItemImage {
  url: string;
  alt: string;
}

interface MenuImagesData {
  [key: string]: MenuItemImage[];
}

// IMPORTANT: Protect this route! Ensure only admins can call it.
// This is a placeholder for actual authentication/authorization logic.
async function isAdmin(_request: NextRequest): Promise<boolean> {
  // Example: Check for a session, user role, or a secret header.
  // const session = await getSession(request); // Your session management
  // if (!session || session.user.role !== 'admin') return false;
  // For now, let's assume it's protected and return true for development.
  // In production, IMPLEMENT REAL AUTH CHECKS.
  console.warn(
    "TODO: Implement proper admin authentication for /api/admin/menu-images. Placeholder usage of _request.url:",
    _request.url
  );
  return true;
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const payload = (await request.json()) as MenuImagesData;

    if (typeof payload !== "object" || payload === null) {
      return NextResponse.json(
        { error: "Invalid payload format." },
        { status: 400 }
      );
    }

    // Use a transaction to ensure atomicity
    const { error: transactionError } = await supabaseServer.rpc(
      "update_menu_items_transactional",
      { payload_data: payload }
    );

    if (transactionError) {
      console.error(
        "Error in transaction updating menu items:",
        transactionError
      );
      return NextResponse.json(
        {
          error: "Failed to update menu items",
          details: transactionError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Menu images updated successfully" });
  } catch (error) {
    console.error("Error processing PUT request:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: "Failed to process request", details: errorMessage },
      { status: 500 }
    );
  }
}

// You would need to create this PostgreSQL function in your Supabase SQL editor:
/*
CREATE OR REPLACE FUNCTION update_menu_items_transactional(payload_data JSONB)
RETURNS VOID AS $$
DECLARE
    item_title TEXT;
    images_array JSONB;
    image_data JSONB;
    display_idx INTEGER;
BEGIN
    -- Iterate over each menu item title in the payload
    FOR item_title IN SELECT jsonb_object_keys(payload_data)
    LOOP
        images_array := payload_data->item_title;

        -- 1. Delete existing images for this menu_item_title
        DELETE FROM public.menu_item_images WHERE menu_item_title = item_title;

        -- 2. Insert new images with updated display_order
        display_idx := 0;
        FOR image_data IN SELECT * FROM jsonb_array_elements(images_array)
        LOOP
            INSERT INTO public.menu_item_images (menu_item_title, image_url, alt_text, display_order)
            VALUES (item_title, image_data->>'url', image_data->>'alt', display_idx);
            display_idx := display_idx + 1;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
*/
