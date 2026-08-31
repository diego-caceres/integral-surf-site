-- Per-trip, per-card title shown above the price on each price card
-- (previously the hardcoded strings "Promo" and "Precio Final" in
-- src/components/trips/PriceComponent.tsx). Defaulted to that same text so
-- existing trips keep rendering exactly as before until an admin edits them.
-- Plain text column, so admins can also clear it to an empty string to hide
-- the title line entirely.
alter table trips
  add column price_promo_title text not null default 'Promo',
  add column price_final_title text not null default 'Precio Final';
