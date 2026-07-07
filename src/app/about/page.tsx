import type { Metadata } from "next";
import Image from "next/image";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import AlternatingSection from "@/components/ui/AlternatingSection";
import { getAboutPage } from "@/lib/about";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conocé al equipo de Integral Surf: instructores apasionados por el surf, el yoga y la naturaleza.",
};

// Static (ISR). Admin edits call revalidatePath("/about") (see
// src/lib/revalidate.ts) and show up immediately; this is just the fallback
// ceiling on staleness if that somehow doesn't fire.
export const revalidate = 3600;

export default async function AboutPage() {
  const aboutData = await getAboutPage();

  if (!aboutData) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-red-500">Error loading about page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-[Eckmannpsych] text-primary mb-8">
            {aboutData.hero_title}
          </h1>
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg md:text-xl text-textPrimary leading-relaxed">
              {aboutData.hero_description_1}
            </p>
            <p className="text-lg md:text-xl text-textPrimary leading-relaxed">
              {aboutData.hero_description_2}
            </p>
          </div>
        </div>
      </section>

      {/* Instructors */}
      {aboutData.instructors.map((instructor, index) => (
        <section
          key={instructor.id}
          className={`py-16 md:py-24 ${
            index % 2 === 0 ? "bg-secondary/20" : "bg-background"
          }`}
        >
          <div className="container mx-auto px-4">
            <AlternatingSection
              title={instructor.name}
              description={instructor.description}
              reverse={index % 2 !== 0}
              media={
                <div className="relative h-[500px] rounded-lg overflow-hidden">
                  <Image
                    src={instructor.image_url}
                    alt={instructor.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              }
            />
          </div>
        </section>
      ))}

      <WhatsAppButton onlyBubble />
    </div>
  );
}
