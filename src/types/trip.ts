export type Trip = {
  id: string; // Unique identifier for the trip
  title: string; // Name of the trip
  destiny: string; // Start date
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
  promoEndDate: string; // Format: YYYY-MM-DD
  location: { lat: number; lng: number };
};
