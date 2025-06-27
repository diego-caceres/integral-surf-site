export type AboutInstructor = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  order_number: number;
};

export type AboutPage = {
  id: string;
  hero_title: string;
  hero_description_1: string;
  hero_description_2: string;
  instructors: AboutInstructor[];
  created_at: string;
  updated_at: string;
};
