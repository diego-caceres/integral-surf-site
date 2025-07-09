"use client";

import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useEffect, useState } from "react";
import type { FundamentosPage } from "@/types/fundamentos";

export default function FundamentosPage() {
  const [fundamentosData, setFundamentosData] =
    useState<FundamentosPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFundamentosData = async () => {
      try {
        const response = await fetch("/api/fundamentos");
        if (!response.ok) {
          throw new Error("Failed to fetch fundamentos data");
        }
        const data = await response.json();
        setFundamentosData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFundamentosData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !fundamentosData) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-red-500">
            Error loading fundamentos page: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sections */}
      {fundamentosData.sections.map((section, index) => (
        <section
          key={section.id}
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
                  <div className="relative h-[500px] rounded-lg overflow-hidden">
                    <Image
                      src={section.image_url}
                      alt={section.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="relative h-[500px] rounded-lg overflow-hidden order-2 md:order-1">
                    <Image
                      src={section.image_url}
                      alt={section.title}
                      fill
                      className="object-cover"
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
                      <div className="relative w-64 h-32 mx-auto rounded-lg overflow-hidden">
                        <Image
                          src={member.image_url}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
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
