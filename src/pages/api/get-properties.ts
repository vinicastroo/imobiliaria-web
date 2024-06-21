import api from '@/services/api'

export interface GetPropertiesResponse {
  properties: {
    id: string
    name: string
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
    type_property: {
      id: string
      description: string
      createdAt: string
    }
    files: {
      id: string
      path: string
    }[]
  }[]
  totalPages: number
}

interface GetPropertiesProps {
  page?: number | null
  type?: string | null
  city?: string | null
  neighborhood?: string | null
  bedrooms?: string | null
  bathrooms?: string | null
  suites?: string | null
  parkingSpots?: string | null
  totalArea?: string | null
  privateArea?: string | null
}
export async function getProperties({
  bathrooms,
  bedrooms,
  city,
  neighborhood,
  parkingSpots,
  privateArea,
  suites,
  totalArea,
  type,
  page,
}: GetPropertiesProps) {
  const response = await api.get<GetPropertiesResponse>('/imovel', {
    params: {
      bathrooms,
      bedrooms,
      city,
      neighborhood,
      parkingSpots,
      privateArea,
      suites,
      totalArea,
      type,
      page,
      pageSize: 12,
      visible: true,
    },
  })

  return response.data
}
