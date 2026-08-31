-- Per-trip, per-card deposit label shown on the price cards (previously the
-- hardcoded string "Reserva con 50%", identical in both cards, in
-- src/components/trips/PriceComponent.tsx). Defaulted to that same text so
-- existing trips keep rendering exactly as before until an admin edits them.
alter table trips
  add column price_promo_deposit_message text not null default 'Reserva con 50%',
  add column price_final_deposit_message text not null default 'Reserva con 50%';
