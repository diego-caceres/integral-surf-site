import ImageSlider from "@/components/ui/ImageSlider";
import type { FundamentosSectionImage } from "@/types/fundamentos";

interface FundamentosImageSliderProps {
  images: FundamentosSectionImage[];
  alt: string;
  priority?: boolean;
}

export default function FundamentosImageSlider({
  images,
  alt,
  priority = false,
}: FundamentosImageSliderProps) {
  return (
    <ImageSlider
      images={images}
      alt={alt}
      priority={priority}
      className="relative h-[500px] rounded-lg overflow-hidden"
    />
  );
}
