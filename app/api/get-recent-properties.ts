import api from 'services/api'
import type { Properties } from './get-properties'

interface GetRecentProperties {
  properties: {
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
  }[]
}
export async function getRecentProperties() {
  const response = await api.get<GetRecentProperties>(
    `/imovel?limit=6&visible=true`,
  )

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
  }
}
