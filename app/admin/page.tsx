"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Eye, Flame, Globe } from 'lucide-react'

import { cn } from '@/lib/utils'
import api from '@/services/api'
import { PeriodSelector } from '@/components/metrics/period-selector'
import { StatCard } from '@/components/metrics/stat-card'
import { SourceChart } from '@/components/metrics/source-chart'
import { TopPropertiesList } from '@/components/metrics/top-properties-list'
import { ViewsChart } from '@/components/metrics/views-chart'
import type { MetricsResponse, Period } from '@/components/metrics/types'

const SOURCE_LABELS: Record<string, string> = {
  DIRECT: 'Direto',
  GOOGLE: 'Google',
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  WHATSAPP: 'WhatsApp',
  OTHER: 'Outros',
}

const sectionReveal = 'animate-in fade-in-0 slide-in-from-bottom-3 duration-500 [animation-fill-mode:both]'

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

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['metrics', period],
    queryFn: async () => {
      const res = await api.get<MetricsResponse>(`/metrics?period=${period}`)
      return res.data
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  const topProperty = data?.topProperties[0]
  const topSource = data?.sourceBreakdown[0]

  return (
    <div className="min-h-screen bg-gray-50 [background-image:radial-gradient(70rem_22rem_at_50%_-8rem,color-mix(in_oklab,var(--primary)_7%,transparent),transparent)]">
      <main className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4', sectionReveal)}>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Métricas do Site</h1>
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Beta</span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">Visualizações dos imóveis e origem do tráfego</p>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        <div
          className={cn(
            'space-y-6 transition-opacity duration-200',
            isFetching && !isLoading && 'opacity-60',
          )}
        >
          <div className={cn('grid grid-cols-1 sm:grid-cols-3 gap-4 [animation-delay:75ms]', sectionReveal)}>
            <StatCard
              title="Total de Visualizações"
              value={(data?.totalViews ?? 0).toLocaleString('pt-BR')}
              icon={Eye}
              loading={isLoading}
            />
            <StatCard
              title="Imóvel Mais Visto"
              value={(topProperty?.views ?? 0).toLocaleString('pt-BR')}
              subtitle={topProperty?.name}
              icon={Flame}
              loading={isLoading}
            />
            <StatCard
              title="Fonte Principal"
              value={topSource ? SOURCE_LABELS[topSource.source] ?? topSource.source : '—'}
              subtitle={topSource ? `${topSource.count.toLocaleString('pt-BR')} visita${topSource.count !== 1 ? 's' : ''}` : undefined}
              icon={Globe}
              loading={isLoading}
            />
          </div>

          <div className={cn('[animation-delay:150ms]', sectionReveal)}>
            <ViewsChart data={data?.dailyViews ?? []} loading={isLoading} />
          </div>

          <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-4 [animation-delay:225ms]', sectionReveal)}>
            <SourceChart data={data?.sourceBreakdown ?? []} loading={isLoading} />
            <TopPropertiesList data={data?.topProperties ?? []} loading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  )
}
