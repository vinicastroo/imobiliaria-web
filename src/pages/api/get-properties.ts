import api from '@/services/api'

export interface Properties {
  id: string
  slug: string
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
export interface GetPropertiesResponse {
  properties: Properties[]
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
  let formattedData: Properties[] = []
  if (response.data.properties.length > 0) {
    formattedData = response.data.properties.map((property) => {
      const newPathsFiles = property.files.map((file) => {
        return {
          ...file,
          path: `https://d2wss3tmei5yh1.cloudfront.net/${file.fileName}`,
        }
      })
      return {
        ...property,
        files: newPathsFiles,
      }
    })
  }

  return {
    properties: formattedData,
    totalPages: response.data.totalPages,
  }
}
