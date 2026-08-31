import { sendGTMEvent } from "@next/third-parties/google";

/**
 * The site's single conversion action is a WhatsApp click — until now no
 * analytics events fired at all, so there was no way to tell which trips,
 * which CTA position, or which pages actually drove contacts. This is the
 * one place that pushes to `dataLayer`, so the event name/param schema stays
 * consistent everywhere it's called (GTM triggers match on exact strings).
 */
export type WhatsAppClickLocation =
  | "floating_bubble"
  | "trip_inline_cta"
  | "price_promo"
  | "price_final"
  | "footer";

export interface WhatsAppClickPayload {
  location: WhatsAppClickLocation;
  /** Present when the click happens on a trip page. */
  tripSlug?: string;
  tripDestiny?: string;
  /** Present for the price-card CTAs. */
  price?: number;
}

export function trackWhatsAppClick(payload: WhatsAppClickPayload): void {
  sendGTMEvent({ event: "whatsapp_click", ...payload });
}
