import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drjbumieuwuzsjlpqwxg.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "talespereira.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
