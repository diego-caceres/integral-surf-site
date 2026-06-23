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

/** Default Open Graph / Twitter share image (1200×630 recommended). */
export const DEFAULT_OG_IMAGE = "/images/about-hero.jpg";

/** Public-facing contact + social profiles, used in Organization JSON-LD. */
export const CONTACT_EMAIL = "integralsurfuy@gmail.com";

export const SOCIAL_PROFILES = [
  "https://www.instagram.com/integralsurf/",
  "https://www.youtube.com/@integralsurf",
];

/** Absolute URL helper — turns a path or relative URL into a full URL. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
