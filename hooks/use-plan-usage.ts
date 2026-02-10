import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

interface ResourceUsage {
  current: number
  limit: number | null
}

interface PlanUsageResponse {
  plan: {
    id: string
    name: string
    defaultPrice: string
    maxUsers: number
    maxRealtors: number
    maxProperties: number
    features: string[]
  } | null
  subscription: {
    id: string
    status: string
    effectivePrice: string
  } | null
  usage: {
    users: ResourceUsage
    realtors: ResourceUsage
    properties: ResourceUsage
  } | null
}

export function usePlanUsage() {
  return useQuery<PlanUsageResponse>({
    queryKey: ['plan-usage'],
    queryFn: async () => {
      const { data } = await api.get<PlanUsageResponse>('/planos/agency')
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}
