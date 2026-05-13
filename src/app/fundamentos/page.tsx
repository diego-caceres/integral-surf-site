import type { Metadata } from "next";
import Image from "next/image";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import FundamentosImageSlider from "@/components/fundamentos/FundamentosImageSlider";
import HashScroller from "./HashScroller";
import { supabaseServer } from "@/lib/supabaseServer";

export const metadata: Metadata = {
  title: "Fundamentos",
  description: "Explorá los pilares de Integral Surf: surfing, yoga, naturaleza y arte. Los fundamentos de una experiencia integral.",
};
import type { FundamentosPage } from "@/types/fundamentos";

async function getFundamentosData(): Promise<FundamentosPage | null> {
  const { data: sectionsData, error: sectionsError } = await supabaseServer
    .from("fundamentos_sections")
    .select("*")
    .order("order_number", { ascending: true });

  if (sectionsError) return null;

  const sectionsWithTeam = await Promise.all(
    (sectionsData || []).map(async (section) => {
      const { data: sectionImages } = await supabaseServer
        .from("fundamentos_section_images")
        .select("*")
        .eq("section_id", section.id)
        .order("order_number", { ascending: true });

      const { data: teamMembers } = await supabaseServer
        .from("fundamentos_team_members")
        .select("*")
        .eq("section_id", section.id)
        .order("order_number", { ascending: true });

      return {
        ...section,
        images: sectionImages || [],
        team_members: teamMembers || [],
      };
    })
  );

  return {
    id: "default",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sections: sectionsWithTeam,
  };
}

export default async function FundamentosPage() {
  const fundamentosData = await getFundamentosData();

  if (!fundamentosData) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-red-500">Error loading fundamentos page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HashScroller />
      {/* Sections */}
      {fundamentosData.sections.map((section, index) => (
        <section
          key={section.id}
          id={`section-${index}`}
          className={`py-16 md:py-24 ${
            index % 2 === 0 ? "bg-secondary/20" : "bg-background"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {index % 2 === 0 ? (
                <>
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-[Eckmannpsych] text-primary">
                      {section.title}
                    </h2>
                    <p className="text-lg text-textPrimary leading-relaxed">
                      {section.description
                        .split("\\n\\n")
                        .map((paragraph, index) => (
                          <span key={index}>
                            {paragraph}
                            {index <
                              section.description.split("\\n\\n").length -
                                1 && <br />}
                          </span>
                        ))}
                    </p>
                  </div>
                  <FundamentosImageSlider
                    images={section.images}
                    alt={section.title}
                  />
                </>
              ) : (
                <>
                  <div className="order-2 md:order-1">
                    <FundamentosImageSlider
                      images={section.images}
                      alt={section.title}
                    />
                  </div>
                  <div className="space-y-6 order-1 md:order-2">
                    <h2 className="text-3xl md:text-4xl font-[Eckmannpsych] text-primary">
                      {section.title}
                    </h2>
                    <p className="text-lg text-textPrimary leading-relaxed">
                      {section.description
                        .split("\\n\\n")
                        .map((paragraph, index) => (
                          <span key={index}>
                            {paragraph}
                            {index <
                              section.description.split("\\n\\n").length -
                                1 && <br />}
                          </span>
                        ))}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Team Section */}
            {section.team_members && section.team_members.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl md:text-3xl font-[Eckmannpsych] text-primary text-center mb-12">
                  Nuestro equipo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.team_members.map((member) => (
                    <div key={member.id} className="text-center space-y-4">
                      {member.image_url && (
                        <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden">
                          <Image
                            src={member.image_url}
                            alt={member.name}
                            fill
                            sizes="192px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-semibold text-primary">
                          {member.name}
                        </h4>
                        <p className="text-sm text-textPrimary leading-relaxed">
                          {member.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      <WhatsAppButton onlyBubble />
    </div>
  );
}
