import { NextResponse, NextRequest } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";
import type { FundamentosPage } from "@/types/fundamentos";
import { isAuthenticatedRequest } from "@/lib/auth";
import { revalidateFundamentos } from "@/lib/revalidate";
import { getFundamentosSections } from "@/lib/fundamentos";
import { apiError } from "@/lib/apiError";

// Enforced centrally in middleware.ts; checked again here as defense in depth.
async function isAdmin(request: NextRequest): Promise<boolean> {
  return isAuthenticatedRequest(request);
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const sections = await getFundamentosSections();

    if (sections === null) {
      return NextResponse.json(
        { error: "Failed to fetch sections" },
        { status: 500 }
      );
    }

    // Create a default fundamentos page structure since we don't have a hero section
    const fullFundamentosPage: FundamentosPage = {
      id: "default",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sections,
    };

    return NextResponse.json(fullFundamentosPage);
  } catch (error) {
    return apiError("GET /api/admin/fundamentos (unexpected):", error);
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
      // Delete existing sections, images, and team members
      const { error: deleteSectionsError } = await supabaseServer
        .from("fundamentos_sections")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all trick

      if (deleteSectionsError) {
        return apiError("PUT /api/admin/fundamentos (delete sections):", deleteSectionsError);
      }

      // Delete existing section images
      const { error: deleteImagesError } = await supabaseServer
        .from("fundamentos_section_images")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all trick

      if (deleteImagesError) {
        return apiError("PUT /api/admin/fundamentos (delete section images):", deleteImagesError);
      }

      // Delete existing team members
      const { error: deleteTeamError } = await supabaseServer
        .from("fundamentos_team_members")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all trick

      if (deleteTeamError) {
        return apiError("PUT /api/admin/fundamentos (delete team members):", deleteTeamError);
      }

      // Insert new sections and their images and team members
      if (sections.length > 0) {
        for (const section of sections) {
          const { data: insertedSection, error: insertSectionError } =
            await supabaseServer
              .from("fundamentos_sections")
              .insert({
                title: section.title,
                description: section.description,
                order_number: section.order_number,
              })
              .select()
              .single();

          if (insertSectionError) {
            return apiError("PUT /api/admin/fundamentos (insert section):", insertSectionError);
          }

          // Insert images for this section
          if (section.images && section.images.length > 0) {
            const imagesToInsert = section.images.map(
              (image: {
                image_url: string;
                alt_text: string | null;
                order_number: number;
              }) => ({
                image_url: image.image_url,
                alt_text: image.alt_text,
                order_number: image.order_number,
                section_id: insertedSection.id,
              })
            );

            const { error: insertImagesError } = await supabaseServer
              .from("fundamentos_section_images")
              .insert(imagesToInsert);

            if (insertImagesError) {
              return apiError(
                "PUT /api/admin/fundamentos (insert section images):",
                insertImagesError
              );
            }
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
              return apiError("PUT /api/admin/fundamentos (insert team members):", insertTeamError);
            }
          }
        }
      }
    }

    revalidateFundamentos();
    return NextResponse.json({
      success: true,
      message: "Fundamentos page updated successfully",
    });
  } catch (error) {
    return apiError("PUT /api/admin/fundamentos (unexpected):", error);
  }
}
