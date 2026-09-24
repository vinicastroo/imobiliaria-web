import { headers } from 'next/headers'
import { MetadataRoute } from 'next'

// Rotas estáticas por tenant — adicione aqui ao criar novos tenants
const TENANT_STATIC_PATHS: Record<string, string[]> = {
  'aurosimobiliaria.com.br': ['/', '/imoveis', '/quem-somos'],
  'imoveisgilli.com.br': ['/', '/imoveis'],
}

const FALLBACK_STATIC_PATHS = ['/', '/imoveis']

interface Property {
  slug: string
  updatedAt?: string
  createdAt: string
}

async function getProperties(agencyId: string): Promise<Property[]> {
  const properties: Property[] = []
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://imobiliaria-api.vercel.app'
  let page = 1
  let totalPages = 1

  do {
    const res = await fetch(`${apiUrl}/imovel?page=${page}&pageSize=1000&visible=true`, {
      headers: { 'x-agency-id': agencyId },
      next: { revalidate: 3600 },
    })
    // Do not publish a successful but incomplete sitemap during API outages.
    if (!res.ok) throw new Error(`Sitemap property lookup failed: ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data.properties) || !Number.isInteger(data.totalPages) || data.totalPages < 0) {
      throw new Error('Invalid sitemap property response')
    }
    properties.push(...data.properties)
    totalPages = data.totalPages
    page += 1
  } while (page <= totalPages)

  return properties
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers()
  const hostname = (headersList.get('host') ?? '').split(':')[0]
  const agencyId = headersList.get('x-tenant-id') ?? process.env.NEXT_PUBLIC_AGENCY_ID

  const baseUrl = `https://${hostname}`
  const staticPaths = TENANT_STATIC_PATHS[hostname] ?? FALLBACK_STATIC_PATHS

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === '/' || path === '/imoveis' ? 'daily' : 'monthly',
    priority: path === '/' ? 1 : path === '/imoveis' ? 0.9 : 0.5,
  }))

  if (!agencyId) throw new Error('Missing agency context for sitemap')

  const properties = await getProperties(agencyId)
  const uniqueProperties = [
    ...new Map(
      properties.filter((property) => property.slug).map((property) => [property.slug, property]),
    ).values(),
  ]
  const propertyRoutes: MetadataRoute.Sitemap = uniqueProperties.map((property) => ({
    url: `${baseUrl}/imoveis/${property.slug}`,
    lastModified: new Date(property.updatedAt ?? property.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...propertyRoutes]
}
