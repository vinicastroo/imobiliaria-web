/* eslint-disable prettier/prettier */
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
    fileName: string
  }[]
}

export async function getProperty(slug: string) {
  if (slug) {
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
  }

  return undefined
}
