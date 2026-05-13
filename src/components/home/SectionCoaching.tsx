"use client";

import Button from "@/components/ui/Button";
import Link from "next/link";
import HomeSectionSlider from "@/components/home/HomeSectionSlider";
import type { HomeSectionImage } from "@/types/homeSections";

interface SectionCoachingProps {
  title?: string;
  description?: string;
  buttonText?: string;
  imageUrl?: string;
  images?: HomeSectionImage[];
}

export default function SectionCoaching({
  title = "La importancia del coaching",
  description = "surf coachs profesionales y experientes nos acompañan compartiéndonos este deporte desde sus raíces. buscamos aprender la técnica y teoría del surf en profundidad.",
  buttonText = "Descubre más",
  imageUrl = "/images/home/coaching.jpg",
  images = [],
}: SectionCoachingProps) {
  return (
    <section aria-labelledby="section-coaching-heading" className="w-full xl-surf:min-h-[90vh] xl-surf:px-20 xl-surf:py-20 pb-10 xl-surf:pb-20 grid grid-cols-1 xl-surf:grid-cols-2 xl-surf:gap-10">
      {/* Left Column - Slideshow (below text on mobile) */}
      <div className="flex flex-row justify-center items-start xl-surf:items-center order-2 xl-surf:order-1">
        <HomeSectionSlider images={images} fallbackUrl={imageUrl || ""} alt="Coaching" />
      </div>

      {/* Right Column - Text (above image on mobile) */}
      <div className="max-w-[660px] mx-auto xl-surf:mx-0 px-10 xl-surf:px-20 py-10 xl-surf:py-20 text-center xl-surf:text-left order-1 xl-surf:order-2">
        <h2 id="section-coaching-heading" className="uppercase font-[Eckmannpsych]">{title}</h2>
        <p className="mt-6 text-xl tracking-[0.2rem]">{description}</p>
        <Link href="/fundamentos">
          <Button className="mt-8 text-xl bg-black hover:bg-gray-900">{buttonText}</Button>
        </Link>
      </div>
    </section>
  );
}
