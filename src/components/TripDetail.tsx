import Image from "next/image";
import parse from "html-react-parser";
import { Trip } from "@/types/trip";
import { bebasNeuelFont } from "@/styles/fonts";
import { libreFranklinFont } from "@/styles/fonts";

import PriceComponent from "@/components/PriceComponent";
import WhatsAppButton from "@/components/WhatsAppButton";

interface TripContentSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  subtitle_2?: string;
  description2?: string;
  imageUrl: string;
  imageLeft?: boolean;
}

function extractVideoId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
}

const TripDetail = ({ trip }: { trip: Trip }) => {
  if (!trip) {
    return <p className="text-center text-gray-500">Viaje no encontrado.</p>;
  }

  const {
    title,
    title_2,
    header_image,
    header_video,
    date_days,
    date_month,
    trip_contents,
    final_img_1,
    final_img_2,
  } = trip;

  const classesIfVideo = header_video ? "pt-[400px]" : "";
  const fonttitle_2IfVideo = header_video
    ? "text-xl md:text-5xl"
    : "text-4xl md:text-7xl";
  const fontTitleIfVideo = header_video
    ? "text-2xl md:text-6xl"
    : "text-5xl md:text-[150px]";

  return (
    <div>
      {/* Header Section */}
      <section className="relative w-full h-[80vh] overflow-hidden">
        {/* Background Video o Image */}
        {header_video ? (
          <div className="relative w-full h-[80vh] overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${extractVideoId(
                header_video
              )}?autoplay=1&mute=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="relative w-full h-[80vh]">
            <Image
              src={header_image || "/images/placeholder.jpg"}
              alt={`${title} - Header`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Title */}
        <div
          className={`${classesIfVideo} absolute inset-0 flex flex-col items-center justify-center md:pb-[100px]`}
        >
          <span
            className={`${bebasNeuelFont.className} tracking-[0.2rem] uppercase text-redColor text-2xl md:text-3xl`}
          >
            Viaje al mar
          </span>
          {title_2 && (
            <h2
              className={`font-[Eckmannpsych] uppercase text-white ${fonttitle_2IfVideo} drop-shadow-2xl  mb-0`}
            >
              {title_2}
            </h2>
          )}
          <h2
            className={`font-[Eckmannpsych] drop-shadow-2xl uppercase text-white ${fontTitleIfVideo} leading-[0.5] mb-5 md:mb-[50px]`}
          >
            {title}
          </h2>
          <span
            className={`${bebasNeuelFont.className} tracking-[0.2rem] uppercase text-redColor text-2xl md:text-3xl`}
          >
            {date_days} {date_month}
          </span>
        </div>
      </section>

      {/* Main Content */}
      <TripDetailSection
        title={trip.section_1_title}
        description={trip.section_1_description}
        secondDescription={trip.section_1_subdescription}
        imageUrl={trip.section_1_image}
      />

      <TripDetailImageSection
        title={trip.section_2_title}
        description={trip.section_2_description}
        imageUrl={trip.section_2_image}
      />

      {trip_contents &&
        trip_contents.map((section, index) => (
          <TripContentSection
            key={index}
            title={section.title}
            description={section.description}
            imageUrl={section.image_url}
            subtitle={section.subtitle}
            subtitle_2={section.subtitle_2}
            description2={section.description_2}
            imageLeft={index % 2 !== 0}
          />
        ))}

      {trip.section_video_url && (
        <TripVideoDetailSection
          title={trip.section_video_title}
          description={trip.section_video_description}
          videoUrl={trip.section_video_url}
        />
      )}

      <PriceComponent
        promotionalPrice={trip.price_promo}
        finalPrice={trip.price_final}
        promoEndMessage={trip.price_promo_message}
        finalPriceMessage={trip.price_final_message}
      />

      <FinalImagesSection final_img_1={final_img_1} final_img_2={final_img_2} />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        {/* Contact Button */}
        <div className="m-auto max-w-[400px] mt-10">
          <WhatsAppButton />
        </div>
      </div>
    </div>
  );
};

export default TripDetail;

const TripDetailSection = ({
  title = "",
  description = "",
  secondDescription = "",
  imageUrl = "",
}: {
  title?: string;
  description?: string;
  secondDescription?: string;
  imageUrl?: string;
}) => {
  return (
    <section className="min-h-[75vh] md:flex items-center gap-4 p-6 md:p-12 md:px-20">
      {/* Left Column */}
      <div className="md:w-[60%] w-full mb-5 md:mb-0">
        <h2 className="font-[Eckmannpsych] tracking-[0.1rem] uppercase text-redColor text-3xl font-bold mb-4">
          {title}
        </h2>
        <p
          className={`${libreFranklinFont.className} tracking-[0.1rem] text-lg mb-6`}
        >
          {parse(description)}
        </p>
        <p
          className={`${libreFranklinFont.className} tracking-[0.1rem] italic text-sm`}
        >
          {secondDescription}
        </p>
      </div>

      {/* Right Column */}
      <div className="md:w-[40%] w-full flex justify-center items-center">
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={500}
          className="object-cover max-h-[500px]"
        />
      </div>
    </section>
  );
};

const TripDetailImageSection = ({
  title = "",
  description = "",
  imageUrl = "",
}: {
  title?: string;
  description?: string;
  secondDescription?: string;
  imageUrl?: string;
}) => {
  return (
    <section className="min-h-[75vh] w-full flex flex-col items-center justify-center shadow-md shadow-gray-200">
      {/* Full-width Image */}
      <div className="w-full h-[300px] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          width={1920}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title and Description */}
      <div className="flex flex-col items-center justify-center m-10 max-w-[700px]">
        <h2 className="font-[Eckmannpsych] tracking-[0.1rem] uppercase text-redColor text-3xl font-bold mb-4 max-w-[300px]">
          {title}
        </h2>
        <p
          className={`${libreFranklinFont.className} tracking-[0.2rem] text-xl my-6 text-left`}
        >
          {parse(description)}
        </p>
      </div>
    </section>
  );
};

const TripContentSection: React.FC<TripContentSectionProps> = ({
  title,
  description,
  imageUrl,
  imageLeft = true,
  subtitle = "",
  subtitle_2 = "",
  description2 = "",
}) => {
  return (
    <section className="w-full flex flex-col md:flex-row items-center md:items-stretch shadow-lg shadow-gray-300">
      <div className="md:hidden w-full md:w-1/2 h-[300px] md:h-[700px]">
        <Image
          src={imageUrl}
          alt={title}
          width={800}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>
      {imageLeft && (
        <div className="hidden md:flex w-full md:w-1/2 h-[300px] md:h-[700px]">
          <Image
            src={imageUrl}
            alt={title}
            width={800}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="w-full md:w-1/2 flex flex-col justify-center md:text-left p-12">
        <h2 className="font-[Eckmannpsych] tracking-[0.1rem] uppercase text-redColor text-3xl font-bold mb-4">
          {title}
        </h2>
        <div>
          {subtitle && (
            <h3 className="font-[Eckmannpsych] tracking-[0.1rem] uppercase text-xl font-semibold mb-4">
              {subtitle}
            </h3>
          )}
          <p
            className={`${libreFranklinFont.className} tracking-[0.2rem] text-lg`}
          >
            {parse(description)}
          </p>
        </div>
        <div className="mt-10">
          {subtitle_2 && (
            <h3 className="font-[Eckmannpsych] tracking-[0.1rem] uppercase text-xl font-semibold mb-4">
              {subtitle_2}
            </h3>
          )}
          {description2 && (
            <p
              className={`${libreFranklinFont.className} tracking-[0.2rem] text-lg`}
            >
              {parse(description2)}
            </p>
          )}
        </div>
      </div>

      {!imageLeft && (
        <div className="hidden md:flex w-full md:w-1/2 h-[300px] md:h-[700px]">
          <Image
            src={imageUrl}
            alt={title}
            width={800}
            height={700}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </section>
  );
};

const TripVideoDetailSection = ({
  title = "",
  description = "",
  videoUrl = "",
}: {
  title?: string;
  description?: string;
  videoUrl: string;
}) => {
  return (
    <section className="min-h-[75vh] md:flex items-center gap-4  md:px-20 shadow-lg shadow-gray-100">
      {/* Left Column */}
      <div className="md:w-[40%] w-full mb-5 md:mb-0 p-12">
        <h3 className="font-[Eckmannpsych] tracking-[0.1rem] uppercase text-xl font-semibold mb-4">
          {title}
        </h3>

        <div className="relative w-full min-h-[270px]  md:h-[300px] overflow-hidden rounded-xl">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${extractVideoId(
              videoUrl
            )}?autoplay=1&mute=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Right Column */}
      <div className="md:w-[60%] w-full flex justify-center items-center p-12">
        <p
          className={`${libreFranklinFont.className} tracking-[0.2rem] text-lg`}
        >
          {parse(description)}
        </p>
      </div>
    </section>
  );
};

const FinalImagesSection = ({
  final_img_1,
  final_img_2,
}: {
  final_img_1?: string;
  final_img_2?: string;
}) => {
  return (
    <section className="h-[700px] md:min-h-[75vh] w-full flex flex-col md:flex-row items-center justify-center">
      <div className="w-full h-[700px] overflow-hidden">
        {final_img_1 && (
          <Image
            src={final_img_1}
            alt="Final Image 1"
            width={1920}
            height={700}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="w-full h-[700px] overflow-hidden">
        {final_img_2 && (
          <Image
            src={final_img_2}
            alt="Final Image 2"
            width={1920}
            height={700}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </section>
  );
};
