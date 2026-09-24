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
  visible: boolean
  latitude: string
  realtors: {
    id: string
    name: string
    creci: string
    phone: string
    avatar: string
  }[]
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

// Scope persistent cache entries to the agency; deduplicate metadata/page reads below.
const getCachedProperty = unstable_cache(
  async (agencyId: string, slug: string) => {
    const response = await api.get<Property>(`/imovel/slug/${encodeURIComponent(slug)}`, {
      headers: { 'x-agency-id': agencyId },
    })
    const data = response.data

    // An invalid API response is a service failure, not a missing property.
    if (!data?.id) throw new Error('Invalid property API response')

    const baseUrl = 'https://d2wss3tmei5yh1.cloudfront.net'
    const items = data.files.map((file) => ({ img: `${baseUrl}/${file.fileName}` }))
    return { ...data, items }
  },
  ['property-v5'],
  { revalidate: 300, tags: ['properties'] },
)

export const getProperty = cache(async (slug: string) => {
  if (!slug) return undefined

  const headersList = await headers()
  const agencyId = headersList.get('x-tenant-id') ?? process.env.NEXT_PUBLIC_AGENCY_ID ?? ''
  if (!agencyId) throw new Error('Missing agency context for property lookup')

  try {
    return await getCachedProperty(agencyId, slug)
  } catch (error) {
    // Only a real 404 should cause notFound() and its automatic noindex tag.
    // Let outages reach the error boundary instead of removing valid pages.
    if (isAxiosError(error) && error.response?.status === 404) return undefined
    throw error
  }
})
