import Image from "next/image";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface SectionTheRoadProps {
  title?: string;
  description?: string;
  buttonText?: string;
  imageUrl?: string;
  image2Url?: string;
  backgroundImageUrl?: string;
}

export default function SectionTheRoad({
  title = "El camino del surf no es solitario",
  description = "juntos aprendemos más y mejor, compartir es un principio básico del surf desde sus orígenes, y es una oportunidad acompañarnos frente a los desafíos que el mar nos propone.",
  buttonText = "Descubre más",
  imageUrl = "/images/home/the-road-img1.png",
  image2Url = "/images/home/the-road-img2.png",
  backgroundImageUrl = "/images/home/sea-background.jpeg",
}: SectionTheRoadProps) {
  return (
    <div className="relative w-full min-[1150px]:min-h-[90vh] min-[1150px]:px-20 min-[1150px]:py-20 pb-10 min-[1150px]:pb-20 grid grid-cols-1 min-[1150px]:grid-cols-2 min-[1150px]:gap-10">
      {/* Background Image */}
      <Image
        src={backgroundImageUrl}
        alt="Background"
        fill
        style={{ objectFit: "cover", zIndex: -1 }}
        priority
      />

      {/* Left Column - Images (below text on mobile) */}
      <div className="flex flex-col gap-4 min-[1150px]:gap-8 justify-center items-center min-[1150px]:items-start order-2 min-[1150px]:order-1">
        <Image
          src={imageUrl}
          alt="Left Image 1"
          width={500}
          height={600}
          className="max-w-full"
        />
        <Image
          src={image2Url}
          alt="Left Image 2"
          width={500}
          height={600}
          className="max-w-full"
        />
      </div>

      {/* Right Column - Text (above images on mobile) */}
      <div className="max-w-[660px] mx-auto min-[1150px]:mx-0 px-10 min-[1150px]:px-20 py-10 min-[1150px]:py-20 text-center min-[1150px]:text-left order-1 min-[1150px]:order-2 text-white">
        <h2 className="uppercase font-[Eckmannpsych]">{title}</h2>
        <p className="mt-6 text-xl tracking-[0.2rem]">{description}</p>
        <Link href="/fundamentos">
          <Button className="mt-8 text-xl">{buttonText}</Button>
        </Link>
      </div>
    </div>
  );
}
