import ImageSlider from "@/components/ui/ImageSlider";
import type { TripContentImage } from "@/types/trip";

interface TripContentImageSliderProps {
  images: TripContentImage[];
  fallbackImageUrl: string;
  alt: string;
}

export default function TripContentImageSlider({
  images,
  fallbackImageUrl,
  alt,
}: TripContentImageSliderProps) {
  return (
    <ImageSlider
      images={images}
      alt={alt}
      fallbackUrl={fallbackImageUrl}
      className="relative w-full h-full overflow-hidden"
    />
  );
}
