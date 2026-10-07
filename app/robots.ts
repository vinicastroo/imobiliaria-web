import { headers } from 'next/headers'
import type { MetadataRoute } from 'next'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host')?.split(':')[0] ?? 'aurosimobiliaria.com.br'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Public pages need Next.js scripts, styles and optimized images to render.
      disallow: ['/login$', '/login/', '/admin$', '/admin/', '/api/'],
    },
    sitemap: `https://${host}/sitemap.xml`,
  }
}
