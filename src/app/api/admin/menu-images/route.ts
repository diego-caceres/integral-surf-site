import { NextResponse, NextRequest } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer"; // Adjusted path
import { isAuthenticatedRequest } from "@/lib/auth";

interface MenuItemImage {
  url: string;
  alt: string;
}

interface MenuImagesData {
  [key: string]: MenuItemImage[];
}

// Enforced centrally in middleware.ts; checked again here as defense in depth.
async function isAdmin(request: NextRequest): Promise<boolean> {
  return isAuthenticatedRequest(request);
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
