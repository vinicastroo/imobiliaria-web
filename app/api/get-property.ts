import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import api from 'services/api'

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
}

// unstable_cache: cache persistente entre requests (revalida a cada 5min)
// agencyId is included as a parameter so Next.js scopes the cache per tenant
const getCachedProperty = unstable_cache(
  async (agencyId: string, slug: string) => {
    try {
      const response = await api.get<Property>(`/imovel/slug/${slug}`, {
        headers: { 'x-agency-id': agencyId },
      })
      const data = response.data

      if (!data) return undefined

      const baseUrl = `https://d2wss3tmei5yh1.cloudfront.net`
      const items = data.files.length > 0
        ? data.files.map((file) => ({
          img: `${baseUrl}/${file.fileName}`,
        }))
        : []

      return { ...data, items }
    } catch {
      return undefined
    }
  },
  ['property'],
  { revalidate: 300, tags: ['properties'] } // 5 minutos
)

// React cache(): deduplica chamadas com o mesmo slug no mesmo request
// (ex: generateMetadata + page render chamam getProperty com o mesmo slug)
export const getProperty = cache(async (slug: string) => {
  if (!slug) return undefined
  const cookieStore = await cookies()
  const agencyId = cookieStore.get('__tenant__')?.value ?? process.env.NEXT_PUBLIC_AGENCY_ID ?? ''
  return getCachedProperty(agencyId, slug)
})
