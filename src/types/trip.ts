export type TripContentImage = {
  id: string;
  image_url: string;
  alt_text?: string | null;
  order_number: number;
};

export type TripContent = {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  subtitle_2?: string;
  description_2?: string;
  image_url: string;
  images?: TripContentImage[];
  trip_id?: string;
  order?: number;
};

export type Trip = {
  id: string;
  slug: string;
  title: string;
  title_2?: string;
  top_subtitle?: string;
  destiny: string;
  coaching_subtitle: string;
  date_month: string;
  date_days: string;
  date_month_2?: string;
  date_days_2?: string;
  header_image: string;
  header_mobile_image?: string;
  header_video?: string;
  price_promo: number;
  price_final: number;
  price_promo_message: string;
  price_final_message: string;
  price_promo_deposit_message: string;
  price_final_deposit_message: string;
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
  is_deleted?: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * The slim column set the public `GET /api/trips` returns — everything the
 * trip menu (Navbar) and calendar cards (SectionCalendar, TripCard) need,
 * and nothing else. The full `Trip` shape (every section's HTML body, prices,
 * etc.) is only needed on a single trip's own detail page, fetched via
 * `getTripBySlug` — shipping it to every visitor just to render a calendar
 * of links wastes bandwidth and leaks unpublished section copy.
 */
export type TripSummary = Pick<
  Trip,
  | "id"
  | "slug"
  | "title"
  | "title_2"
  | "destiny"
  | "coaching_subtitle"
  | "date_month"
  | "date_days"
  | "date_month_2"
  | "date_days_2"
  | "order"
>;

/** Admin trip listing additionally needs is_deleted for the "show deleted" toggle. */
export type AdminTripSummary = TripSummary & { is_deleted?: boolean };
