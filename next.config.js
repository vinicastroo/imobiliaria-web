/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx'],
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    domains: [
      'images.unsplash.com',
      'auros-s3.s3.amazonaws.com',
      'd2wss3tmei5yh1.cloudfront.net',
    ],
    loader: 'default',
    unoptimized: false,
  },
  swcMinify: true,
}

module.exports = nextConfig
