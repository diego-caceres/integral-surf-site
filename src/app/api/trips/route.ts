/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const includeContents = searchParams.get("includeContents") === "true";

  try {
    let query = supabaseServer
      .from("trips")
      .select(includeContents ? "*, trip_contents(*)" : "*")
      .order("order", { ascending: true });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing request", details: error },
      { status: 500 }
    );
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
      return NextResponse.json({ error: viajeError.message }, { status: 500 });
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
        return NextResponse.json(
          { error: contentsError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, viaje });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la solicitud", originalError: error },
      { status: 500 }
    );
  }
}
