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
    <div className="w-full min-[1150px]:min-h-[90vh] min-[1150px]:px-20 min-[1150px]:py-20 pb-10 min-[1150px]:pb-20 grid grid-cols-1 min-[1150px]:grid-cols-2 min-[1150px]:gap-10">
      {/* Left Column - Slideshow (below text on mobile) */}
      <div className="flex flex-row justify-center items-start min-[1150px]:items-center order-2 min-[1150px]:order-1">
        <HomeSectionSlider images={images} fallbackUrl={imageUrl || ""} alt="Coaching" />
      </div>

      {/* Right Column - Text (above image on mobile) */}
      <div className="max-w-[660px] mx-auto min-[1150px]:mx-0 px-10 min-[1150px]:px-20 py-10 min-[1150px]:py-20 text-center min-[1150px]:text-left order-1 min-[1150px]:order-2">
        <h2 className="uppercase font-[Eckmannpsych]">{title}</h2>
        <p className="mt-6 text-xl tracking-[0.2rem]">{description}</p>
        <Link href="/fundamentos">
          <Button className="mt-8 text-xl bg-black hover:bg-gray-900">{buttonText}</Button>
        </Link>
      </div>
    </div>
  );
}
