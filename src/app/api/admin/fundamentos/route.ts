import { NextResponse, NextRequest } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";
import type { FundamentosPage } from "@/types/fundamentos";

// IMPORTANT: Protect this route! Ensure only admins can call it.
async function isAdmin(_request: NextRequest): Promise<boolean> {
  // TODO: Implement proper admin authentication
  console.warn(
    "TODO: Implement proper admin authentication for /api/admin/fundamentos. Placeholder usage of _request.url:",
    _request.url
  );
  return true;
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

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
    console.error("Unexpected error in GET /api/admin/fundamentos:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { sections } = body;

    // Update sections if provided
    if (sections && Array.isArray(sections)) {
      // Delete existing sections and team members
      const { error: deleteSectionsError } = await supabaseServer
        .from("fundamentos_sections")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all trick

      if (deleteSectionsError) {
        console.error("Error deleting sections:", deleteSectionsError);
        return NextResponse.json(
          {
            error: "Failed to delete sections",
            details: deleteSectionsError.message,
          },
          { status: 500 }
        );
      }

      // Delete existing team members
      const { error: deleteTeamError } = await supabaseServer
        .from("fundamentos_team_members")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all trick

      if (deleteTeamError) {
        console.error("Error deleting team members:", deleteTeamError);
        return NextResponse.json(
          {
            error: "Failed to delete team members",
            details: deleteTeamError.message,
          },
          { status: 500 }
        );
      }

      // Insert new sections and their team members
      if (sections.length > 0) {
        for (const section of sections) {
          const { data: insertedSection, error: insertSectionError } =
            await supabaseServer
              .from("fundamentos_sections")
              .insert({
                title: section.title,
                description: section.description,
                image_url: section.image_url,
                order_number: section.order_number,
              })
              .select()
              .single();

          if (insertSectionError) {
            console.error("Error inserting section:", insertSectionError);
            return NextResponse.json(
              {
                error: "Failed to insert section",
                details: insertSectionError.message,
              },
              { status: 500 }
            );
          }

          // Insert team members for this section
          if (section.team_members && section.team_members.length > 0) {
            const teamMembersToInsert = section.team_members.map(
              (member: {
                name: string;
                description: string;
                image_url: string;
                order_number: number;
              }) => ({
                name: member.name,
                description: member.description,
                image_url: member.image_url,
                order_number: member.order_number,
                section_id: insertedSection.id,
              })
            );

            const { error: insertTeamError } = await supabaseServer
              .from("fundamentos_team_members")
              .insert(teamMembersToInsert);

            if (insertTeamError) {
              console.error("Error inserting team members:", insertTeamError);
              return NextResponse.json(
                {
                  error: "Failed to insert team members",
                  details: insertTeamError.message,
                },
                { status: 500 }
              );
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Fundamentos page updated successfully",
    });
  } catch (error) {
    console.error("Unexpected error in PUT /api/admin/fundamentos:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
