import { supabaseServer } from "@/lib/supabaseServer";
import type {
  FundamentosSection,
  FundamentosSectionImage,
  FundamentosTeamMember,
} from "@/types/fundamentos";

type NestedSection = FundamentosSection & {
  fundamentos_section_images?: FundamentosSectionImage[];
  fundamentos_team_members?: FundamentosTeamMember[];
};

/**
 * Fetches every Fundamentos section with its images and team members
 * attached, in a single Supabase round-trip via a nested select — instead of
 * one query for the sections plus two more per section (images, team
 * members), which was the previous N+1 shared by the public page and both
 * the public and admin API routes.
 *
 * Returns `null` on a query error (distinct from a legitimate empty result)
 * so callers can tell "failed to load" apart from "no sections yet".
 */
export async function getFundamentosSections(): Promise<
  FundamentosSection[] | null
> {
  const { data, error } = await supabaseServer
    .from("fundamentos_sections")
    .select("*, fundamentos_section_images(*), fundamentos_team_members(*)")
    .order("order_number", { ascending: true });

  if (error) return null;
  if (!data) return [];

  return (data as NestedSection[]).map(
    ({ fundamentos_section_images, fundamentos_team_members, ...section }) => ({
      ...section,
      images: (fundamentos_section_images ?? [])
        .slice()
        .sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0)),
      team_members: (fundamentos_team_members ?? [])
        .slice()
        .sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0)),
    })
  );
}
