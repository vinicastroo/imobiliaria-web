import api from '@/services/api'
import { MetadataRoute } from 'next'

// Defina a URL base do seu site (em produção)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aurosimobiliaria.com.br'
const AGENCY_ID = process.env.NEXT_PUBLIC_AGENCY_ID

interface Property {
  slug: string
  updatedAt?: string
  createdAt: string
}

async function getAllProperties() {
  if (!AGENCY_ID) {
    console.error('❌ AGENCY_ID não definido no .env. O Sitemap não pode ser gerado.')
    return []
  }

  try {
    const response = await api.get('imovel', {
      params: {
        pageSize: 1000, // Tenta buscar até 1000 imóveis de uma vez
        visible: 'true', // Apenas imóveis ativos no site
      },
      headers: {
        'x-agency-id': AGENCY_ID
      }
    })

    if (!response.data) {
      throw new Error('Falha ao buscar imóveis para o sitemap')
    }


    // A rota /todos retorna { properties: [], totalCount: ... }
    return response.data.properties || []
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getAllProperties()

  const propertiesUrls = properties.map((property: Property) => ({
    url: `${BASE_URL}/imoveis/${property.slug}`,
    lastModified: new Date(property.updatedAt || property.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/imoveis`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  return [...staticRoutes, ...propertiesUrls]
}