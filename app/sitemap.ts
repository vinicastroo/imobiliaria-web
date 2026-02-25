import { headers } from 'next/headers'
import { MetadataRoute } from 'next'

// Rotas estáticas por tenant — adicione aqui ao criar novos tenants
const TENANT_STATIC_PATHS: Record<string, string[]> = {
  'aurosimobiliaria.com.br': ['/', '/imoveis', '/quem-somos'],
  'imoveisgilli.com.br':     ['/', '/imoveis'],
}

const FALLBACK_STATIC_PATHS = ['/', '/imoveis']

interface Property {
  slug: string
  updatedAt?: string
  createdAt: string
}

async function getProperties(agencyId: string): Promise<Property[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/imovel?pageSize=1000&visible=true`,
      {
        headers: { 'x-agency-id': agencyId },
        next: { revalidate: 3600 },
      },
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.properties ?? []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers()
  const hostname = (headersList.get('host') ?? '').split(':')[0]
  const agencyId = headersList.get('x-tenant-id') ?? process.env.NEXT_PUBLIC_AGENCY_ID

  const baseUrl = `https://${hostname}`
  const staticPaths = TENANT_STATIC_PATHS[hostname] ?? FALLBACK_STATIC_PATHS

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/' || path === '/imoveis' ? 'daily' : 'monthly',
    priority: path === '/' ? 1 : path === '/imoveis' ? 0.9 : 0.5,
  }))

  if (!agencyId) return staticRoutes

  const properties = await getProperties(agencyId)
  const propertyRoutes: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${baseUrl}/imoveis/${property.slug}`,
    lastModified: new Date(property.updatedAt ?? property.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...propertyRoutes]
}
