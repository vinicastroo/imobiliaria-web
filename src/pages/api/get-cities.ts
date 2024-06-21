import api from '@/services/api'

interface GetCities {
  city: string
}

export async function getCities() {
  const response = await api.get<GetCities[]>(`/imovel/cidades`)

  return response.data
}
