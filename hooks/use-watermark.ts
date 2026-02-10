import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

interface AgencySettingsResponse {
  logo: string | null
  watermark: string | null
}

export function useWatermark() {
  const { data } = useQuery<AgencySettingsResponse>({
    queryKey: ['agency-settings'],
    queryFn: async () => {
      const { data } = await api.get<AgencySettingsResponse>('/agency-settings')
      return data
    },
    staleTime: Infinity,
  })

  return { watermarkUrl: data?.watermark ?? null }
}
