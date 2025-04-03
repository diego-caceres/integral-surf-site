export type TripContent = {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  subtitle_2?: string;
  description_2?: string;
  image_url: string;
  trip_id?: string;
};

export type Trip = {
  id: string;
  slug: string;
  title: string;
  title_2?: string;
  destiny: string;
  coaching_subtitle: string;
  date_month: string;
  date_days: string;
  header_image: string;
  header_video?: string;
  price_promo: number;
  price_final: number;
  price_promo_message: string;
  price_final_message: string;
  section_1_title: string;
  section_1_description: string;
  section_1_subdescription: string;
  section_1_image: string;
  section_2_title: string;
  section_2_description: string;
  section_2_image: string;
  section_video_title: string;
  section_video_description: string;
  section_video_url: string;
  final_img_1: string;
  final_img_2: string;
  order: number;
  trip_contents?: TripContent[];
};

// export interface TripContent {
//   id: string;
//   trip_id: string;
//   content_type: string;
//   title?: string;
//   description?: string;
//   image_url?: string;
//   order?: number;
//   created_at: string;
// }

// export interface Trip {
//   id: string;
//   title: string;
//   slug: string;
//   description: string;
//   image_url: string;
//   created_at: string;
//   trip_contents?: TripContent[];
// }

// export type Trip = {
//   id: string; // Unique identifier for the trip
//   slug: string; // URL slug for the trip
//   title: string; // Name of the trip
//   title2?: string; // Name of the trip
//   destiny: string; // Start date
//   coachingSubtitle: string;
//   date: string; // Start date
//   date2: string; // End date
//   description: string; // Detailed description of the trip
//   shortDescription: string; // Detailed description of the trip
//   seats: number; // Available seats
//   headerImage?: string; // Path to the header image (optional)
//   headerVideo?: string; // URL to the header video (optional)
//   images: string[]; // Array of image paths for the trip gallery
//   promoPrice: number;
//   finalPrice: number;
//   promoEndMessage?: string;
//   finalPriceMessage?: string;
//   location: { lat: number; lng: number };
//   section1Title?: string;
//   section1Description?: string;
//   section1Description2?: string;
//   section1Image?: string;
//   section2Title?: string;
//   section2Description?: string;
//   section2Image?: string;
//   contentSections?: ContentSection[];
//   sectionVideoTitle?: string;
//   sectionVideoDescription?: string;
//   sectionVideoUrl?: string;
//   finalImage1?: string;
//   finalImage2?: string;
// };

// export type ContentSection = {
//   title: string;
//   subtitle?: string;
//   description: string;
//   subtitle2?: string;
//   description2?: string;
//   imageUrl: string;
// };
