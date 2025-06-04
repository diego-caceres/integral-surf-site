import { NextResponse } from "next/server";
// Import the initialized Supabase client
import { supabaseServer } from "../../../lib/supabaseServer";

// Define a type for the items fetched from Supabase
interface MenuItemImageFromDB {
  menu_item_title: string;
  image_url: string;
  alt_text: string | null; // Assuming alt_text can be null in the DB
  display_order: number;
}

// Define the structure for the formatted data to be returned by the API
interface FormattedMenuImagesData {
  [key: string]: { url: string; alt: string }[];
}

export async function GET() {
  // Use the imported Supabase client directly
  const { data, error } = await supabaseServer // Changed from createSupabaseServerClient()
    .from("menu_item_images")
    .select("menu_item_title, image_url, alt_text, display_order")
    .order("menu_item_title")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching menu images:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu images", details: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json({});
  }

  // Process data into the desired nested structure
  const formattedData = (data as MenuItemImageFromDB[]).reduce(
    (acc: FormattedMenuImagesData, item: MenuItemImageFromDB) => {
      const title = item.menu_item_title;
      if (!acc[title]) {
        acc[title] = [];
      }
      acc[title].push({ url: item.image_url, alt: item.alt_text || "" });
      return acc;
    },
    {} as FormattedMenuImagesData
  );

  return NextResponse.json(formattedData);
}

// The old placeholder data and optional GET function with query params can be removed.
