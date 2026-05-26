import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",

        hostname:
          "res.cloudinary.com",
      },

      {
        protocol: "https",

        hostname:
          "catalogoapiv-001-site1.qtempurl.com",
      },
    ],
  },
};

export default nextConfig;