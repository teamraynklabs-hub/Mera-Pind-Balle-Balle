import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "./",
  },

  serverExternalPackages: ["cloudinary"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
