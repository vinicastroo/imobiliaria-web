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
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://imobiliaria-api.vercel.app'
    console.log('[getCachedProperty] CACHE MISS — chamando API | agencyId:', agencyId || '(vazio!)', '| slug:', slug, '| url:', `${baseURL}/imovel/slug/${slug}`)

    // Diagnóstico extra: raw fetch para comparar com axios
    try {
      const rawRes = await fetch(`${baseURL}/imovel/slug/${encodeURIComponent(slug)}`, {
        headers: { 'x-agency-id': agencyId },
      })
      console.log('[getCachedProperty] raw fetch status:', rawRes.status, '| slug:', slug, '| agencyId:', agencyId || '(vazio!)')
    } catch (fetchErr) {
      console.error('[getCachedProperty] raw fetch falhou:', fetchErr)
    }

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
      const responseBody = isAxiosError(error) ? JSON.stringify(error.response?.data) : null
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://imobiliaria-api.vercel.app'
      console.error('[getCachedProperty] erro | agencyId:', agencyId || '(vazio!)', '| slug:', slug, '| status:', status, '| body:', responseBody, '| url completa:', `${baseURL}/imovel/slug/${slug}`)
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
