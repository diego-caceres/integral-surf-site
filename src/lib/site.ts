/**
 * Central site-wide constants used for SEO (metadata, canonical URLs,
 * sitemap, robots and structured data).
 *
 * The production URL is read from NEXT_PUBLIC_SITE_URL so it can be changed
 * in one place (e.g. Vercel env vars) without touching code. It falls back to
 * the registered domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://integralsurf.com.uy"
).replace(/\/$/, "");

export const SITE_NAME = "Integral Surf";

/**
 * Default Open Graph / Twitter share image (1200×630).
 * Cloudinary-hosted and transformed on the fly (c_fill 1200×630, q_auto, f_jpg)
 * so it stays small (~80 KB) and within social platforms' size limits.
 */
export const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/dm1x2j4gp/image/upload/c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/v1772658065/integral-surf/section-headers/web/kc3gy84l7arsfnxooagq.jpg";

/** Public-facing contact + social profiles, used in Organization JSON-LD. */
export const CONTACT_EMAIL = "integralsurfuy@gmail.com";

/**
 * Fallback WhatsApp number used before the `whatsapp_phone_number` config
 * value (admin-editable, see /admin/configurations) has loaded or if it's
 * unset. Previously hardcoded separately in four places (WhatsAppButton,
 * PriceComponent, the trip detail page, and the Footer) — a single source
 * means updating it once actually updates every fallback.
 */
export const DEFAULT_WHATSAPP_PHONE = "+59899748323";

export const SOCIAL_PROFILES = [
  "https://www.instagram.com/integralsurf/",
  "https://www.youtube.com/@integralsurf",
];

/** Absolute URL helper — turns a path or relative URL into a full URL. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
