/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { apiError } from "@/lib/apiError";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const includeContents = searchParams.get("includeContents") === "true";

  try {
    const query = supabaseServer
      .from("trips")
      .select(includeContents ? "*, trip_contents(*)" : "*")
      .order("order", { ascending: true });

    const { data, error } = await query;

    if (error) {
      return apiError("GET /api/trips:", error);
    }

    return NextResponse.json(data);
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

    // 2️⃣ Insertar los contenidos relacionados (si existen)
    if (contents && contents.length > 0) {
      const contentsData = contents.map((content: any) => ({
        trip_id: viaje.id, // Relaciona con el viaje creado
        ...content,
      }));

      const { error: contentsError } = await supabaseServer
        .from("trip_contents")
        .insert(contentsData);

      if (contentsError) {
        return apiError("POST /api/trips (insert contents):", contentsError);
      }
    }

    return NextResponse.json({ success: true, viaje });
  } catch (error) {
    return apiError("POST /api/trips (unexpected):", error);
  }
}
