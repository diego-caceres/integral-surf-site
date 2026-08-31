import type { NextConfig } from "next";
import withBundleAnalyzerInit from "@next/bundle-analyzer";

const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: process.env.ANALYZE === "true",
});

// Applied to every response. These are conservative — they harden the app
// (clickjacking, MIME sniffing, referrer leakage, feature access) without
// constraining script/style sources, which a full CSP would risk breaking.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // Every next/image in the app is routed through src/lib/cloudinaryLoader.ts
    // instead of Vercel's built-in optimizer. Per-image `loader={...}` props
    // were tried first but don't work here: about/page.tsx, fundamentos/page.tsx,
    // TripDetail.tsx, and SectionExperiences.tsx are Server Components, and
    // passing a function prop from a Server Component into next/image throws
    // ("Functions cannot be passed directly to Client Components"). A
    // config-level loader is resolved by the framework, not passed through
    // JSX, so it works uniformly in both server and client components.
    //
    // Trade-off: local static assets (e.g. /images/icons/logo.png) also go
    // through this loader now. cloudinaryLoader() passes non-Cloudinary URLs
    // through unchanged, which means those specific images render at their
    // original file size/format instead of through Next's built-in resizing —
    // acceptable here since they're already small, pre-optimized static files.
    loader: "custom",
    loaderFile: "./src/lib/cloudinaryLoader.ts",
    // remotePatterns is inert once a custom loader is set (Next no longer
    // proxies through /_next/image), kept only as a record of which hosts
    // legitimately serve images — verified against live data on 2026-07-07:
    // every image_url in every content table is Cloudinary-hosted.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hfvqfhkxssecvpzqgoqt.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
