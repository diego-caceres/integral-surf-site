import ImageSlider from "@/components/ui/ImageSlider";
import type { HomeSectionImage } from "@/types/homeSections";

interface HomeSectionSliderProps {
  images: HomeSectionImage[];
  fallbackUrl: string;
  alt?: string;
}

export default function HomeSectionSlider({
  images,
  fallbackUrl,
  alt = "",
}: HomeSectionSliderProps) {
  return (
    <ImageSlider
      images={images}
      alt={alt}
      fallbackUrl={fallbackUrl}
      className="relative w-full max-w-[500px] aspect-[4/3] xl-surf:aspect-[5/6] overflow-hidden"
      sizes="(max-width: 768px) 100vw, 500px"
    />
  );
}
