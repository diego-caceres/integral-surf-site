/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { apiError } from "@/lib/apiError";
import { revalidateTripPages } from "@/lib/revalidate";
import { READ_CACHE } from "@/lib/httpCache";

// Public listing: active trips only, and only the summary columns the trip
// menu (Navbar) and calendar cards (SectionCalendar, TripCard) actually use.
// Previously this selected `*` with no is_deleted filter, so every visitor's
// browser downloaded every section's full HTML body for every trip —
// including soft-deleted ones — through a CDN-cached response. The admin UI
// (which needs deleted trips, for its restore toggle) now uses the
// authenticated /api/admin/trips instead.
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("trips")
      .select(
        "id, slug, title, title_2, destiny, coaching_subtitle, date_month, date_days, date_month_2, date_days_2, order"
      )
      .eq("is_deleted", false)
      .order("order", { ascending: true });

    if (error) {
      return apiError("GET /api/trips:", error);
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": READ_CACHE },
    });
  } catch (error) {
    return apiError("GET /api/trips (unexpected):", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    const { contents, ...viajeData } = formData; // Extraemos contents del objeto principal

    // 1️⃣ Insertar el viaje en Supabase
    const { data: viaje, error: viajeError } = await supabaseServer
      .from("trips")
      .insert([viajeData])
      .select()
      .single();

    if (viajeError) {
      return apiError("POST /api/trips (insert trip):", viajeError);
    }

    // 2️⃣ Insertar los contenidos relacionados (si existen), uno por vez para
    // capturar el id nuevo de cada uno y poder guardar sus imágenes de
    // slideshow — antes este insert por lotes no soportaba imágenes (el
    // formulario de creación tampoco las ofrecía), así que un viaje creado
    // nunca podía tener slideshow hasta que se editaba.
    if (contents && contents.length > 0) {
      for (const content of contents) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { images, id: _incomingId, ...contentFields } = content as any;

        const { data: insertedContent, error: contentError } = await supabaseServer
          .from("trip_contents")
          .insert({ ...contentFields, trip_id: viaje.id })
          .select()
          .single();

        if (contentError || !insertedContent) {
          return apiError(
            "POST /api/trips (insert content):",
            contentError ?? new Error("Insert returned no row")
          );
        }

        if (images && images.length > 0) {
          const { error: imagesError } = await supabaseServer
            .from("trip_content_images")
            .insert(
              images.map((img: any, i: number) => ({
                trip_content_id: insertedContent.id,
                image_url: img.image_url,
                alt_text: img.alt_text ?? null,
                order_number: i,
              }))
            );

          if (imagesError) {
            return apiError("POST /api/trips (insert content images):", imagesError);
          }
        }
      }
    }

    revalidateTripPages();
    return NextResponse.json({ success: true, viaje });
  } catch (error) {
    return apiError("POST /api/trips (unexpected):", error);
  }
}
