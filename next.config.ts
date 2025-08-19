import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dyvdbkrbxyvii.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "previews.dropbox.com",
      },
      {
        protocol: "https",
        hostname: "kixjqzztmfwagbwywcsx.supabase.co",
      },
      {
        protocol: "https",
        hostname: "uasbzkitkuqmvcpggcts.supabase.co",
      },
    ],
  },
};

export default nextConfig;
