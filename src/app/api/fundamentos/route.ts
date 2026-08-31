import { NextResponse } from "next/server";
import { FundamentosPage } from "@/types/fundamentos";
import { READ_CACHE } from "@/lib/httpCache";
import { getFundamentosSections } from "@/lib/fundamentos";
import { apiError } from "@/lib/apiError";

export async function GET() {
  try {
    const sections = await getFundamentosSections();

    if (sections === null) {
      return apiError("GET /api/fundamentos:", new Error("Failed to fetch sections"));
    }

    // Create a default fundamentos page structure since we don't have a hero section
    const fullFundamentosPage: FundamentosPage = {
      id: "default",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sections,
    };

    return NextResponse.json(fullFundamentosPage, {
      headers: { "Cache-Control": READ_CACHE },
    });
  } catch (error) {
    return apiError("GET /api/fundamentos (unexpected):", error);
  }
}
