import Image from "next/image";
import Button from "@/components/ui/Button";

export default function SectionTheRoad() {
  return (
    <div className="relative w-full h-screen overflow-hidden ">
      {/* Background Image */}
      <Image
        src="/images/home/sea-background.jpeg"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        priority
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-6 ">
        <div className="flex flex-col md:grid md:grid-cols-2 md:pl-[100px] w-full gap-6 text-white">
          {/* Left Column (Shown below on mobile) */}
          <div className="flex flex-col md:gap-8 justify-center order-2 md:order-1 ">
            <Image
              src="/images/home/the-road-img1.png"
              alt="Left Image 1"
              width={450}
              height={380}
            />
            <Image
              src="/images/home/the-road-img2.png"
              alt="Left Image 2"
              width={450}
              height={274}
            />
          </div>

          {/* Right Column (Shown first on mobile) */}
          <div className="mt-10 md:mt-0 md:max-w-[450px] flex flex-col items-center md:items-start justify-center  gap-4 order-1 md:order-2 ">
            <h2 className="uppercase font-[Eckmannpsych] md:text-left text-white ">
              El camino del surf no es solitario
            </h2>
            <p className="text-white md:text-left text-xl">
              juntos aprendemos más y mejor, <br />
              compartir es un principio básico del surf <br />
              desde sus orígenes, y es una <br />
              oportunidad acompañarnos frente a los <br />
              desafíos que el mar nos propone.
            </p>
            <Button className="mt-4 text-xl">Descubre más</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
