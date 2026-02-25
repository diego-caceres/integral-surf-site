-- Store products catalog
CREATE TABLE IF NOT EXISTS public.store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  image_url TEXT,
  available_sizes TEXT[] NOT NULL DEFAULT '{}',
  available_colors TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.store_products
  ADD COLUMN IF NOT EXISTS available_sizes TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE public.store_products
  ADD COLUMN IF NOT EXISTS available_colors TEXT[] NOT NULL DEFAULT '{}';

-- Store orders header
CREATE TABLE IF NOT EXISTS public.store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_instagram TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  currency TEXT NOT NULL,
  subtotal_cents INTEGER NOT NULL CHECK (subtotal_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Store order line items
CREATE TABLE IF NOT EXISTS public.store_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.store_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.store_products(id),
  product_name_snapshot TEXT NOT NULL,
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  selected_size TEXT,
  selected_color TEXT,
  subtotal_cents INTEGER NOT NULL CHECK (subtotal_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.store_order_items
  ADD COLUMN IF NOT EXISTS selected_size TEXT;

ALTER TABLE public.store_order_items
  ADD COLUMN IF NOT EXISTS selected_color TEXT;

CREATE INDEX IF NOT EXISTS idx_store_products_active_order
  ON public.store_products(is_active, sort_order);

CREATE INDEX IF NOT EXISTS idx_store_order_items_order_id
  ON public.store_order_items(order_id);

-- Keep updated_at fresh
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_store_products_updated_at ON public.store_products;
CREATE TRIGGER trg_store_products_updated_at
BEFORE UPDATE ON public.store_products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_store_orders_updated_at ON public.store_orders;
CREATE TRIGGER trg_store_orders_updated_at
BEFORE UPDATE ON public.store_orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Optional sample data
INSERT INTO public.store_products (
  slug,
  name,
  description,
  price_cents,
  currency,
  image_url,
  available_sizes,
  available_colors,
  sort_order
)
VALUES
  (
    'remera-classic',
    'Remera Integral Surf',
    '100% algodón, fit regular',
    2500,
    'USD',
    NULL,
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['Negro', 'Arena', 'Blanco'],
    1
  ),
  (
    'gorra-aloha',
    'Gorra Aloha',
    'Gorra ajustable con logo bordado',
    1800,
    'USD',
    NULL,
    ARRAY[]::TEXT[],
    ARRAY['Negro', 'Azul'],
    2
  ),
  (
    'buzo-oceano',
    'Buzo Océano',
    'Buzo frizado unisex',
    4800,
    'USD',
    NULL,
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY[]::TEXT[],
    3
  )
ON CONFLICT (slug) DO NOTHING;
