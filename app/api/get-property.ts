import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import api from 'services/api'

export interface Property {
  id: string
  name: string
  slug: string
  code: string
  summary: string
  description: string
  value: string
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
const getCachedProperty = unstable_cache(
  async (slug: string) => {
    const response = await api.get<Property>(`/imovel/slug/${slug}`)
    const data = response.data

    const condition = data && data.files.length > 0

    const baseUrl = `https://d2wss3tmei5yh1.cloudfront.net`
    const items = condition
      ? data?.files.map((file) => ({
        img: `${baseUrl}/${file.fileName}`,
      }))
      : []

    return { ...data, items }
  },
  ['property'],
  { revalidate: 300, tags: ['properties'] } // 5 minutos
)

// React cache(): deduplica chamadas com o mesmo slug no mesmo request
// (ex: generateMetadata + page render chamam getProperty com o mesmo slug)
export const getProperty = cache(async (slug: string) => {
  if (!slug) return undefined
  return getCachedProperty(slug)
})
