import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "instagram.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
    ],
    domains: ["instagram.com", "scontent.cdninstagram.com"],
  },
};

export default nextConfig;
