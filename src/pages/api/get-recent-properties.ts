import api from '@/services/api'

interface GetRecentProperties {
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
}
export async function getRecentProperties() {
  const response = await api.get<GetRecentProperties>(
    `/imovel?limit=6&visible=true`,
  )

  return response.data
}
