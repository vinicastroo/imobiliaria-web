/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias
    domains: [
      'images.unsplash.com',
      'auros-s3.s3.amazonaws.com',
      'd2wss3tmei5yh1.cloudfront.net',
    ],

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
  swcMinify: true,

  async headers() {
    return [
      // Segurança básica
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // ative HSTS somente se SEMPRE servir via HTTPS
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // permissões conservadoras
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'payment=(self)',
            ].join(','),
          },
        ],
      },
      // Cache agressivo de assets estáticos gerados pelo Next
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache de imagens do próprio domínio
      {
        source: '/:all*(png|jpg|jpeg|gif|webp|avif|svg)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache de fontes
      {
        source: '/:all*(woff|woff2|ttf|otf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
