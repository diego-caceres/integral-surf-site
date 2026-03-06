import { libreFranklinFont } from "@/styles/fonts";
import Image from "next/image";

interface SectionExperiencesProps {
  title?: string;
  description?: string;
  videoUrl?: string;
}

export default function SectionExperiences({
  title = "Experiencias Integrales",
  description = "En este ciclo de entrevistas a viajeros, Federico García nos cuenta sobre su experiencia aprendiendo a surfear con Integral en Perú",
  videoUrl = "https://www.youtube.com/embed/EDKX-i1_yMI?si=CLg0ghvuidtUVpG9&autoplay=1&mute=1",
}: SectionExperiencesProps) {
  return (
    <div className="relative w-full min-[1300px]:h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/home/experiences-background.jpg"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        priority
      />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col min-[1300px]:grid min-[1300px]:grid-cols-[30%_70%] min-[1300px]:absolute min-[1300px]:inset-0 min-[1300px]:pl-[100px] w-full min-[1300px]:h-full gap-6 min-[1300px]:items-start min-[1300px]:pt-20">
        {/* Left Column */}
        <div className="flex flex-col gap-4 min-[1300px]:gap-8 justify-center px-10 min-[1300px]:px-20 py-10 min-[1300px]:py-20 text-left">
          <h2 className="uppercase font-[Eckmannpsych]">{title}</h2>
          <p
            className={`${libreFranklinFont.className} tracking-[0.1rem] text-lg`}
          >
            {description}
          </p>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center min-[1300px]:items-start w-full justify-center px-10 min-[1300px]:px-0 pb-10 min-[1300px]:pb-0">
          <div className="relative w-full aspect-video min-[1300px]:w-[800px] min-[1300px]:h-[450px] min-[1300px]:aspect-auto overflow-hidden rounded-xl">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
