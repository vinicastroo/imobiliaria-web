import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

export interface Infrastructure {
  id: string
  name: string
}

export function useInfrastructures() {
  const { data, isLoading } = useQuery<Infrastructure[]>({
    queryKey: ['infrastructures'],
    queryFn: async () => {
      const res = await api.get('/infraestrutura')
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })

  return {
    infrastructures: data ?? [],
    isLoading,
  }
}
