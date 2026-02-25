export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  image_url: string | null;
  available_sizes: string[];
  available_colors: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CartLineItemInput = {
  productId: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
};

export type StoreOrderCustomer = {
  name: string;
  email: string;
  phone?: string;
  instagram?: string;
};
