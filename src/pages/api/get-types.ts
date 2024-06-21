import api from '@/services/api'

interface GetTypesResponse {
  id: string
  createdAt: string
  description: string
}
export async function getTypes() {
  const response = await api.get<GetTypesResponse[]>('/tipo-imovel')
  return response.data
}
