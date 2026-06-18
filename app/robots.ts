import { headers } from 'next/headers'
import type { MetadataRoute } from 'next'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host')?.split(':')[0] ?? 'aurosimobiliaria.com.br'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login/', '/admin/', '/api/', '/_next/'],
    },
    sitemap: `https://${host}/sitemap.xml`,
  }
}
