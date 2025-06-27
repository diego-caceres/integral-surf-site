"use client";

import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useEffect, useState } from "react";
import type { AboutPage } from "@/types/about";

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch("/api/about");
        if (!response.ok) {
          throw new Error("Failed to fetch about data");
        }
        const data = await response.json();
        setAboutData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded mb-8"></div>
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

  if (error || !aboutData) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-red-500">Error loading about page: {error}</p>
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
