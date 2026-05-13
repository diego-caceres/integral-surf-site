import type { Metadata } from "next";
import Image from "next/image";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { supabaseServer } from "@/lib/supabaseServer";
import type { AboutPage } from "@/types/about";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conocé al equipo de Integral Surf: instructores apasionados por el surf, el yoga y la naturaleza.",
};

async function getAboutData(): Promise<AboutPage | null> {
  const { data: aboutData, error: aboutError } = await supabaseServer
    .from("about_page")
    .select("*")
    .single();

  if (aboutError || !aboutData) return null;

  const { data: instructorsData } = await supabaseServer
    .from("about_instructors")
    .select("*")
    .order("order_number", { ascending: true });

  return { ...aboutData, instructors: instructorsData || [] };
}

export default async function AboutPage() {
  const aboutData = await getAboutData();

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {index % 2 === 0 ? (
                <>
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-[Eckmannpsych] text-primary">
                      {instructor.name}
                    </h2>
                    <p className="text-lg text-textPrimary leading-relaxed">
                      {instructor.description
                        .split("\\n\\n")
                        .map((paragraph, index) => (
                          <span key={index}>
                            {paragraph}
                            {index <
                              instructor.description.split("\\n\\n").length -
                                1 && <br />}
                          </span>
                        ))}
                    </p>
                  </div>
                  <div className="relative h-[500px] rounded-lg overflow-hidden">
                    <Image
                      src={instructor.image_url}
                      alt={instructor.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="relative h-[500px] rounded-lg overflow-hidden order-2 md:order-1">
                    <Image
                      src={instructor.image_url}
                      alt={instructor.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-6 order-1 md:order-2">
                    <h2 className="text-3xl md:text-4xl font-[Eckmannpsych] text-primary">
                      {instructor.name}
                    </h2>
                    <p className="text-lg text-textPrimary leading-relaxed">
                      {instructor.description
                        .split("\\n\\n")
                        .map((paragraph, index) => (
                          <span key={index}>
                            {paragraph}
                            {index <
                              instructor.description.split("\\n\\n").length -
                                1 && <br />}
                          </span>
                        ))}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      ))}

      <WhatsAppButton onlyBubble />
    </div>
  );
}
