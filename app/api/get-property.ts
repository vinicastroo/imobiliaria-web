import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import api from 'services/api'
import { isAxiosError } from 'axios'

export interface Property {
  id: string
  name: string
  slug: string
  code: string
  summary: string
  description: string
  value: string
  priceOnRequest: boolean
  pricePrefix: boolean
  transactionType: 'VENDA' | 'ALUGUEL'
  applyWatermark: boolean
  bedrooms: string
  bathrooms: string
  parkingSpots: string
  suites: string
  totalArea: string
  privateArea: string
  createdAt: string
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  numberAddress: string
  longitude: string
  latitude: string
  realtors: {
    id: string
    name: string
    creci: string
    phone: string
    avatar: string
  }[],
  type_property: {
    id: string
    description: string
    createdAt: string
  }
  files: {
    id: string
    path: string
    fileName: string
  }[]
  property_infrastructures: {
    infrastructure: {
      id: string
      name: string
    }
  }[]
}

// unstable_cache: cache persistente entre requests (revalida a cada 5min)
// agencyId is included as a parameter so Next.js scopes the cache per tenant
// Key bumped to 'property-v2' to bust any stale undefined entries from previous deploys
const getCachedProperty = unstable_cache(
  async (agencyId: string, slug: string) => {
    try {
      const response = await api.get<Property>(`/imovel/slug/${slug}`, {
        headers: { 'x-agency-id': agencyId },
      })
      const data = response.data

      if (!data) return null

      const baseUrl = `https://d2wss3tmei5yh1.cloudfront.net`
      const items = data.files.length > 0
        ? data.files.map((file) => ({
          img: `${baseUrl}/${file.fileName}`,
        }))
        : []

      return { ...data, items }
    } catch (error) {
      // Genuine "not found" — cache the null so we don't hammer the API
      if (isAxiosError(error) && error.response?.status === 404) return null
      // Transient error (network, 5xx) — do NOT cache, allow retry on next request
      console.error('[getProperty] API error:', { agencyId, slug, status: isAxiosError(error) ? error.response?.status : 'unknown' })
      throw error
    }
  },
  ['property-v2'],
  { revalidate: 300, tags: ['properties'] } // 5 minutos
)

export const getProperty = cache(async (slug: string) => {
  if (!slug) return undefined
  const agencyId =
    (await headers()).get('x-tenant-id') ?? process.env.NEXT_PUBLIC_AGENCY_ID ?? ''
  try {
    const result = await getCachedProperty(agencyId, slug)
    return result ?? undefined
  } catch {
    return undefined
  }
})
