"use client";

import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import HomeSectionSlider from "@/components/home/HomeSectionSlider";
import type { HomeSectionImage } from "@/types/homeSections";

interface SectionTheRoadProps {
  title?: string;
  description?: string;
  buttonText?: string;
  imageUrl?: string;
  image2Url?: string;
  backgroundImageUrl?: string;
  images?: HomeSectionImage[];
}

export default function SectionTheRoad({
  title = "El camino del surf no es solitario",
  description = "juntos aprendemos más y mejor, compartir es un principio básico del surf desde sus orígenes, y es una oportunidad acompañarnos frente a los desafíos que el mar nos propone.",
  buttonText = "Descubre más",
  imageUrl = "/images/home/the-road-img1.png",
  image2Url = "/images/home/the-road-img2.png",
  backgroundImageUrl = "/images/home/sea-background.jpeg",
  images = [],
}: SectionTheRoadProps) {
  // When no slideshow images are configured, seed fallbacks from the two legacy URLs
  const effectiveImages: HomeSectionImage[] =
    images.length > 0
      ? images
      : [
          imageUrl && { id: "f1", image_url: imageUrl, order_number: 0 },
          image2Url && { id: "f2", image_url: image2Url, order_number: 1 },
        ].filter(Boolean) as HomeSectionImage[];

  return (
    <section aria-labelledby="section-road-heading" className="relative w-full xl-surf:min-h-[90vh] xl-surf:px-20 xl-surf:py-20 pb-10 xl-surf:pb-20 grid grid-cols-1 xl-surf:grid-cols-2 xl-surf:gap-10">
      {/* Background Image */}
      <Image
        src={backgroundImageUrl}
        alt=""
        fill
        style={{ objectFit: "cover", zIndex: -1 }}
        priority
      />

      {/* Left Column - Slideshow (below text on mobile) */}
      <div className="flex flex-row justify-center items-start xl-surf:items-center order-2 xl-surf:order-1">
        <HomeSectionSlider images={effectiveImages} fallbackUrl={imageUrl} alt="The Road" />
      </div>

      {/* Right Column - Text (above images on mobile) */}
      <div className="max-w-[660px] mx-auto xl-surf:mx-0 px-10 xl-surf:px-20 py-10 xl-surf:py-20 text-center xl-surf:text-left order-1 xl-surf:order-2 text-white">
        <h2 id="section-road-heading" className="uppercase font-[Eckmannpsych] text-white">{title}</h2>
        <p className="mt-6 text-xl tracking-[0.2rem]">{description}</p>
        <Link href="/fundamentos">
          <Button className="mt-8 text-xl bg-black hover:bg-gray-900">{buttonText}</Button>
        </Link>
      </div>
    </section>
  );
}
