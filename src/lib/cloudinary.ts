/**
 * Helpers for serving Cloudinary images with automatic format (WebP/AVIF) and
 * quality compression. Raw Cloudinary URLs (e.g. .../upload/v123/foo.jpg) are
 * full-size originals — a single header can be several MB. Inserting an
 * `f_auto,q_auto` transformation after `/upload/` lets Cloudinary deliver a
 * format- and size-appropriate version straight from its CDN.
 *
 * Non-Cloudinary URLs (local /images/..., Supabase storage, etc.) are returned
 * untouched.
 */

const UPLOAD_SEGMENT = "/image/upload/";

export function isCloudinary(url?: string | null): url is string {
  return typeof url === "string" && url.includes("res.cloudinary.com");
}

/**
 * Inserts a Cloudinary transformation into an upload URL.
 * `cloudinaryUrl(url, "f_auto,q_auto,w_1920")`
 */
export function cloudinaryUrl(url: string, transform: string): string {
  if (!isCloudinary(url) || !url.includes(UPLOAD_SEGMENT)) return url;
  return url.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}${transform}/`);
}

/**
 * Builds a responsive srcSet across the given widths. Uses `c_limit` so images
 * are never upscaled past their original dimensions.
 */
export function cloudinarySrcSet(
  url: string,
  widths: number[],
  base = "f_auto,q_auto"
): string {
  if (!isCloudinary(url)) return "";
  return widths
    .map((w) => `${cloudinaryUrl(url, `${base},c_limit,w_${w}`)} ${w}w`)
    .join(", ");
}
