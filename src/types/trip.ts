export type Trip = {
  id: string; // Unique identifier for the trip
  slug: string; // URL slug for the trip
  title: string; // Name of the trip
  title2?: string; // Name of the trip
  destiny: string; // Start date
  coachingSubtitle: string;
  date: string; // Start date
  date2: string; // End date
  description: string; // Detailed description of the trip
  shortDescription: string; // Detailed description of the trip
  seats: number; // Available seats
  headerImage?: string; // Path to the header image (optional)
  headerVideo?: string; // URL to the header video (optional)
  images: string[]; // Array of image paths for the trip gallery
  promoPrice: number;
  finalPrice: number;
  promoEndMessage?: string;
  finalPriceMessage?: string;
  location: { lat: number; lng: number };
  section1Title?: string;
  section1Description?: string;
  section1Description2?: string;
  section1Image?: string;
  section2Title?: string;
  section2Description?: string;
  section2Image?: string;
  contentSections?: ContentSection[];
};

export type ContentSection = {
  title: string;
  subtitle?: string;
  description: string;
  subtitle2?: string;
  description2?: string;
  imageUrl: string;
};
