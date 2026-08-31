import type { Metadata } from "next";
import Image from "next/image";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import FundamentosImageSlider from "@/components/fundamentos/FundamentosImageSlider";
import AlternatingSection from "@/components/ui/AlternatingSection";
import HashScroller from "./HashScroller";
import { getFundamentosSections } from "@/lib/fundamentos";

export const metadata: Metadata = {
  title: "Fundamentos",
  description: "Explorá los pilares de Integral Surf: surfing, yoga, naturaleza y arte. Los fundamentos de una experiencia integral.",
};

// Static (ISR). Admin edits call revalidatePath("/fundamentos") (see
// src/lib/revalidate.ts) and show up immediately; this is just the fallback
// ceiling on staleness if that somehow doesn't fire.
export const revalidate = 3600;

import type { FundamentosPage } from "@/types/fundamentos";

async function getFundamentosData(): Promise<FundamentosPage | null> {
  const sections = await getFundamentosSections();
  if (!sections) return null;

  return {
    id: "default",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sections,
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
            <AlternatingSection
              title={section.title}
              description={section.description}
              reverse={index % 2 !== 0}
              media={
                <FundamentosImageSlider
                  images={section.images}
                  alt={section.title}
                  priority={index === 0}
                />
              }
            />

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
