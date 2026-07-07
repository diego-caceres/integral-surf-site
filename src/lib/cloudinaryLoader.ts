import { cloudinaryUrl, isCloudinary } from "@/lib/cloudinary";

/**
 * Global custom loader for next/image (wired via `images.loaderFile` in
 * next.config.ts — every next/image in the app goes through this). Cloudinary
 * already serves format- and size-appropriate images from its own CDN (see
 * src/lib/cloudinary.ts) — without this, every `next/image` pointed at a
 * Cloudinary URL got re-downloaded and re-encoded a second time by Vercel's
 * image optimizer, burning optimization-request quota and adding a hop for
 * no benefit.
 *
 * A per-image `loader={cloudinaryLoader}` prop was tried first, but Server
 * Components (about/page.tsx, TripDetail.tsx, etc.) can't pass a function
 * prop into next/image — only a config-level loader works everywhere.
 *
 * Non-Cloudinary sources (local /images/..., Supabase storage, etc.) are
 * passed straight through unresized — `cloudinaryUrl` is already a no-op for
 * those, so this only affects the specific images that aren't Cloudinary URLs.
 */
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!isCloudinary(src)) return src;
  return cloudinaryUrl(src, `f_auto,q_${quality ?? "auto"},c_limit,w_${width}`);
}
