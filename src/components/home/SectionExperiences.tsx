import { libreFranklinFont } from "@/styles/fonts";
import Image from "next/image";
import LazyYouTubeEmbed from "@/components/ui/LazyYouTubeEmbed";

interface SectionExperiencesProps {
  title?: string;
  description?: string;
  videoUrl?: string;
  backgroundImageUrl?: string;
}

function buildVideoSrc(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}autoplay=1&mute=1`;
}

export default function SectionExperiences({
  title = "Experiencias Integrales",
  description = "En este ciclo de entrevistas a viajeros, Federico García nos cuenta sobre su experiencia aprendiendo a surfear con Integral en Perú",
  videoUrl = "https://www.youtube.com/embed/EDKX-i1_yMI?si=CLg0ghvuidtUVpG9",
  backgroundImageUrl = "/images/home/experiences-background.jpg",
}: SectionExperiencesProps) {
  return (
    <section aria-labelledby="section-experiences-heading" className="relative w-full lg:h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src={backgroundImageUrl}
        alt=""
        fill
        style={{ objectFit: "cover" }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-[35%_65%] lg:absolute lg:inset-0 lg:pl-[100px] w-full lg:h-full gap-6 lg:items-center">
        {/* Left Column */}
        <div className="flex flex-col gap-4 lg:gap-8 justify-center px-10 lg:px-0 py-10 lg:py-0 text-left">
          <h2 id="section-experiences-heading" className="uppercase font-[Eckmannpsych] text-white">{title}</h2>
          <p
            className={`${libreFranklinFont.className} tracking-[0.2rem] text-xl text-white`}
          >
            {description}
          </p>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center w-full justify-center px-10 lg:px-8 pb-10 lg:pb-0">
          <LazyYouTubeEmbed src={buildVideoSrc(videoUrl)} title="YouTube video player" />
        </div>
      </div>
    </section>
  );
}
