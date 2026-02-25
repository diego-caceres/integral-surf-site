import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { StoreProduct } from "@/types/store";

type StoreProductRow = Omit<StoreProduct, "available_sizes" | "available_colors"> & {
  available_sizes: string[] | null;
  available_colors: string[] | null;
};

export async function GET(request: NextRequest) {
  const includeInactive = request.nextUrl.searchParams.get("all") === "true";

  try {
    let query = supabaseServer
      .from("store_products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const products = ((data ?? []) as StoreProductRow[]).map((product) => ({
      ...product,
      available_sizes: Array.isArray(product.available_sizes)
        ? product.available_sizes
        : [],
      available_colors: Array.isArray(product.available_colors)
        ? product.available_colors
        : [],
    }));

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing request", details: String(error) },
      { status: 500 }
    );
  }
}
