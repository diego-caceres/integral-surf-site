import Image from "next/image";
import Button from "@/components/ui/Button";

export default function SectionTheRoad() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden pt-20">
      {/* Background Image */}
      <Image
        src="/images/home/sea-background.jpeg"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        priority
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-start justify-center p-6 pb-10">
        <div className="flex flex-col md:grid md:grid-cols-2 md:pl-[100px] w-full gap-6 text-white">
          {/* Left Column (Shown below on mobile) */}
          <div className="flex flex-col gap-4 md:gap-8 justify-center order-2 md:order-1 ">
            <Image
              src="/images/home/the-road-img1.png"
              alt="Left Image 1"
              width={450}
              height={380}
              className="max-w-full"
            />
            <Image
              src="/images/home/the-road-img2.png"
              alt="Left Image 2"
              width={450}
              height={274}
              className="max-w-full"
            />
          </div>

          {/* Right Column (Shown first on mobile) */}
          <div className="md:max-w-[450px] flex flex-col items-center md:items-start justify-center gap-4 order-1 md:order-2 py-10 md:py-20 text-left">
            <h2 className="uppercase font-[Eckmannpsych] text-white text-3xl md:text-5xl">
              El camino del surf no es solitario
            </h2>
            <p className="text-white text-lg md:text-xl">
              juntos aprendemos más y mejor, compartir es un principio básico
              del surf desde sus orígenes, y es una oportunidad acompañarnos
              frente a los desafíos que el mar nos propone.
            </p>
            <Button className="mt-4 text-lg md:text-xl">Descubre más</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
