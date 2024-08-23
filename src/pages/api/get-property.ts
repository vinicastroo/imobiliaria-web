import api from '@/services/api'

export interface Property {
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
}

export async function getProperty(id: string) {
  const response = await api.get<Property>(`/imovel/${id}`)
  const data = response.data

  const condition = data && data.files.length > 0

  const items = condition ? data?.files.map((file) => ({ img: file.path })) : []

  return { ...data, items }
}
