import ImageSlider from "@/components/ui/ImageSlider";
import type { FundamentosSectionImage } from "@/types/fundamentos";

interface FundamentosImageSliderProps {
  images: FundamentosSectionImage[];
  alt: string;
}

export default function FundamentosImageSlider({
  images,
  alt,
}: FundamentosImageSliderProps) {
  return (
    <ImageSlider
      images={images}
      alt={alt}
      className="relative h-[500px] rounded-lg overflow-hidden"
    />
  );
}
