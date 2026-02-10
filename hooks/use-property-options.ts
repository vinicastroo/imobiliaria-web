import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import type { TypeProperty, Realtor, Enterprise } from '@/components/property-form/types'

export function usePropertyOptions() {
  const typesQuery = useQuery<TypeProperty[]>({
    queryKey: ['property-types'],
    queryFn: async () => {
      const res = await api.get('/tipo-imovel')
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const realtorsQuery = useQuery<Realtor[]>({
    queryKey: ['realtors'],
    queryFn: async () => {
      const res = await api.get('/corretor')
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const enterprisesQuery = useQuery<Enterprise[]>({
    queryKey: ['enterprises'],
    queryFn: async () => {
      const res = await api.get('/empreendimento')
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })

  return {
    types: typesQuery.data ?? [],
    realtors: realtorsQuery.data ?? [],
    enterprises: enterprisesQuery.data ?? [],
    isLoading: typesQuery.isLoading || realtorsQuery.isLoading || enterprisesQuery.isLoading,
  }
}
