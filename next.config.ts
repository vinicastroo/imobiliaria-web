import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'auros-s3.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'd2wss3tmei5yh1.cloudfront.net',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
