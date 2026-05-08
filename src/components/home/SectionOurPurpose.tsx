"use client";

import Button from "@/components/ui/Button";
import Link from "next/link";
import HomeSectionSlider from "@/components/home/HomeSectionSlider";
import type { HomeSectionImage } from "@/types/homeSections";

interface SectionOurPurposeProps {
  title?: string;
  description?: string;
  quote?: string;
  buttonText?: string;
  imageUrl?: string;
  images?: HomeSectionImage[];
}

const SectionOurPurpose: React.FC<SectionOurPurposeProps> = ({
  title = "Nuestro proposito",
  description = "es ayudarte a lograr tus objetivos de manera consciente, ya sea conectar por primera vez con el surf o a mejorar tu performance sobre las olas.",
  quote = "Elegimos la naturaleza para interpretar lo más profundo de nuestro ser. El surfing, el yoga y el arte son las experiencias que nos permiten reencontrarnos",
  buttonText = "Sobre Nosotros",
  imageUrl = "/images/home/image1.png",
  images = [],
}) => {
  return (
    <section
      className="w-full min-[1150px]:min-h-[90vh] min-[1150px]:px-20 min-[1150px]:py-20 grid grid-cols-1 min-[1150px]:grid-cols-2 min-[1150px]:gap-10"
      style={{ boxShadow: "0 1px 2px -2px #7f807e" }}
    >
      <div className="max-w-[660px] mx-auto min-[1150px]:mx-0 px-10 min-[1150px]:px-20 py-10 min-[1150px]:py-20 text-center min-[1150px]:text-left">
        <h2 className="font-[Eckmannpsych]">{title}</h2>
        <p className="mt-6 text-xl tracking-[0.2rem]">{description}</p>
        <p className="mt-10 text-xl tracking-[0.2rem]">
          &ldquo;{quote}&rdquo;.
        </p>
        <Link href="/about">
          <Button className="mt-8 text-xl bg-black hover:bg-gray-900">{buttonText}</Button>
        </Link>
      </div>
      <div className="flex flex-row justify-center items-start min-[1150px]:items-center">
        <HomeSectionSlider images={images} fallbackUrl={imageUrl || ""} alt="Nuestro propósito" />
      </div>
    </section>
  );
};

export default SectionOurPurpose;
