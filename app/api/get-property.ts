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
// Key bumped to 'property-v3' to bust stale null entries from previous deploys
const getCachedProperty = unstable_cache(
  async (agencyId: string, slug: string) => {
    console.log('[getCachedProperty] CACHE MISS — chamando API | agencyId:', agencyId, '| slug:', slug)
    try {
      const response = await api.get<Property>(`/imovel/slug/${slug}`, {
        headers: { 'x-agency-id': agencyId },
      })
      const data = response.data

      console.log('[getCachedProperty] API ok | slug:', slug, '| property.id:', data?.id, '| property.name:', data?.name)

      if (!data) {
        console.warn('[getCachedProperty] API retornou status 200 mas body vazio | slug:', slug)
        return null
      }

      const baseUrl = `https://d2wss3tmei5yh1.cloudfront.net`
      const items = data.files.length > 0
        ? data.files.map((file) => ({
          img: `${baseUrl}/${file.fileName}`,
        }))
        : []

      return { ...data, items }
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : 'unknown'
      console.error('[getCachedProperty] erro | agencyId:', agencyId || '(vazio!)', '| slug:', slug, '| status:', status)
      // Nunca retornar null aqui — throw garante que o unstable_cache NÃO armazena
      // o resultado, permitindo retry na próxima requisição.
      // Retornar null cachearia o "not found" permanentemente até o TTL expirar,
      // quebrando imóveis que existem mas tiveram 404 transitório (agencyId errado, etc).
      throw error
    }
  },
  // Key bumped to 'property-v4' to bust stale null entries cached by previous versions
  ['property-v4'],
  { revalidate: 300, tags: ['properties'] } // 5 minutos
)

export const getProperty = cache(async (slug: string) => {
  if (!slug) {
    console.warn('[getProperty] slug vazio ou undefined')
    return undefined
  }

  const headersList = await headers()
  const agencyId = headersList.get('x-tenant-id') ?? process.env.NEXT_PUBLIC_AGENCY_ID ?? ''

  console.log('[getProperty] slug:', slug, '| agencyId resolvido:', agencyId || '(vazio!)', '| x-tenant-id header:', headersList.get('x-tenant-id'), '| NEXT_PUBLIC_AGENCY_ID:', process.env.NEXT_PUBLIC_AGENCY_ID)

  try {
    const result = await getCachedProperty(agencyId, slug)

    if (result === null) {
      console.error('[getProperty] resultado null (404 cacheado ou property não existe) | slug:', slug, '| agencyId:', agencyId)
    } else {
      console.log('[getProperty] property encontrada | slug:', slug, '| id:', result.id)
    }

    return result ?? undefined
  } catch (err) {
    console.error('[getProperty] exceção capturada | slug:', slug, '| agencyId:', agencyId, '| erro:', err)
    return undefined
  }
})
