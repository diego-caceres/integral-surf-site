import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { FundamentosPage } from "@/types/fundamentos";

export async function GET() {
  try {
    // Create a default fundamentos page structure since we don't have a hero section
    const fundamentosData = {
      id: "default",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Fetch the sections with their team members
    const { data: sectionsData, error: sectionsError } = await supabaseServer
      .from("fundamentos_sections")
      .select("*")
      .order("order_number", { ascending: true });

    if (sectionsError) {
      console.error("Error fetching sections:", sectionsError);
      return NextResponse.json(
        {
          error: "Failed to fetch sections",
          details: sectionsError.message,
        },
        { status: 500 }
      );
    }

    // For each section, fetch its team members
    const sectionsWithTeam = await Promise.all(
      (sectionsData || []).map(async (section) => {
        const { data: teamMembers, error: teamError } = await supabaseServer
          .from("fundamentos_team_members")
          .select("*")
          .eq("section_id", section.id)
          .order("order_number", { ascending: true });

        if (teamError) {
          console.error(
            "Error fetching team members for section:",
            section.id,
            teamError
          );
          return {
            ...section,
            team_members: [],
          };
        }

        return {
          ...section,
          team_members: teamMembers || [],
        };
      })
    );

    // Combine the data
    const fullFundamentosPage: FundamentosPage = {
      ...fundamentosData,
      sections: sectionsWithTeam,
    };

    return NextResponse.json(fullFundamentosPage);
  } catch (error) {
    console.error("Unexpected error in GET /api/fundamentos:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
