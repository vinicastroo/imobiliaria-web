import api from 'services/api'

interface GetNeighborhoods {
  neighborhood: string
}

interface getNeighborhoodsProps {
  city: string | undefined
}
export async function getNeighborhoods({ city }: getNeighborhoodsProps) {
  if (!city) {
    return []
  }

  const response = await api.get<GetNeighborhoods[]>(`/imovel/bairro/${city}`)
  return response.data
}
