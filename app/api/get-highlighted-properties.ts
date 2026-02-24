import api from 'services/api'
import type { Properties } from './get-properties'

const CLOUDFRONT_BASE = 'https://d2wss3tmei5yh1.cloudfront.net'

interface ApiProperty extends Omit<Properties, 'files'> {
  files: { id: string; path: string; fileName: string }[]
}

interface GetPropertiesResponse {
  properties: ApiProperty[]
}

export async function getHighlightedProperties(agencyId?: string) {
  const response = await api.get<GetPropertiesResponse>('/imovel', {
    params: { highlighted: true, visible: true, pageSize: 3 },
    ...(agencyId && { headers: { 'x-agency-id': agencyId } }),
  })

  const properties = response.data.properties.map((property) => ({
    ...property,
    files: property.files.map((file) => ({
      ...file,
      path: `${CLOUDFRONT_BASE}/${file.fileName}`,
    })),
  }))

  return { properties }
}
