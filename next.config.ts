import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "instagram.com",
        port: "",
        pathname: "/integralsurf/**",
      },
    ],
  },
};

export default nextConfig;
