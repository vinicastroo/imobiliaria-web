"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import api from '@/services/api'
import { PeriodSelector } from '@/components/metrics/period-selector'
import { StatCard } from '@/components/metrics/stat-card'
import { SourceChart } from '@/components/metrics/source-chart'
import { TopPropertiesList } from '@/components/metrics/top-properties-list'
import type { MetricsResponse, Period } from '@/components/metrics/types'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const role = session?.user?.role

  useEffect(() => {
    if (role && role !== 'OWNER' && role !== 'MANAGER') {
      router.replace('/admin/imoveis')
    }
  }, [role, router])
  const [period, setPeriod] = useState<Period>('30d')

  const { data, isLoading } = useQuery({
    queryKey: ['metrics', period],
    queryFn: async () => {
      const res = await api.get<MetricsResponse>(`/metrics?period=${period}`)
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const topProperty = data?.topProperties[0]
  const topSource = data?.sourceBreakdown[0]

  const sourceLabels: Record<string, string> = {
    DIRECT: 'Direto',
    GOOGLE: 'Google',
    FACEBOOK: 'Facebook',
    INSTAGRAM: 'Instagram',
    WHATSAPP: 'WhatsApp',
    OTHER: 'Outros',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Métricas do Site</h1>
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Beta</span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">Visualizações dos imóveis e origem do tráfego</p>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total de Visualizações"
            value={data?.totalViews ?? 0}
            loading={isLoading}
          />
          <StatCard
            title="Imóvel Mais Visto"
            value={topProperty?.views ?? 0}
            subtitle={topProperty?.name}
            loading={isLoading}
          />
          <StatCard
            title="Fonte Principal"
            value={topSource ? sourceLabels[topSource.source] ?? topSource.source : '—'}
            subtitle={topSource ? `${topSource.count} visita${topSource.count !== 1 ? 's' : ''}` : undefined}
            loading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SourceChart data={data?.sourceBreakdown ?? []} loading={isLoading} />
          <TopPropertiesList data={data?.topProperties ?? []} loading={isLoading} />
        </div>
      </main>
    </div>
  )
}
