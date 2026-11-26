'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Eye, Flame, Globe } from 'lucide-react'

import { cn } from '@/lib/utils'
import api from '@/services/api'
import { PeriodSelector } from '@/components/metrics/period-selector'
import { AdminPage, PageHeader } from '@/components/admin/page'
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

const sectionReveal =
  'animate-in fade-in-0 slide-in-from-bottom-3 duration-500 [animation-fill-mode:both]'

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
    queryKey: ['metrics', session?.user?.agencyId, session?.user?.id, period],
    enabled: Boolean(session?.user?.agencyId) && (role === 'OWNER' || role === 'MANAGER'),
    queryFn: async () => {
      const res = await api.get<MetricsResponse>(`/metrics?period=${period}`)
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const topProperty = data?.topProperties[0]
  const topSource = data?.sourceBreakdown[0]

  return (
    <AdminPage>
      <PageHeader
        className={sectionReveal}
        title="Métricas do site"
        badge={
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
            Beta
          </span>
        }
        description="Visualizações dos imóveis e origem do tráfego."
        actions={<PeriodSelector value={period} onChange={setPeriod} />}
      />

      <div
        className={cn(
          'space-y-6 transition-opacity duration-200',
          isFetching && !isLoading && 'opacity-60',
        )}
      >
        <div
          className={cn(
            'grid grid-cols-1 gap-4 [animation-delay:75ms] sm:grid-cols-3',
            sectionReveal,
          )}
        >
          <StatCard
            title="Total de Visualizações"
            value={data?.totalViews ?? 0}
            icon={Eye}
            loading={isLoading}
          />
          <StatCard
            title="Imóvel Mais Visto"
            value={topProperty?.views ?? 0}
            subtitle={topProperty?.name}
            icon={Flame}
            loading={isLoading}
          />
          <StatCard
            title="Fonte Principal"
            value={topSource ? (SOURCE_LABELS[topSource.source] ?? topSource.source) : '—'}
            subtitle={
              topSource
                ? `${topSource.count.toLocaleString('pt-BR')} visita${topSource.count !== 1 ? 's' : ''}`
                : undefined
            }
            icon={Globe}
            loading={isLoading}
          />
        </div>

        <div className={cn('[animation-delay:150ms]', sectionReveal)}>
          <ViewsChart data={data?.dailyViews ?? []} loading={isLoading} />
        </div>

        <div
          className={cn(
            'grid grid-cols-1 gap-4 [animation-delay:225ms] lg:grid-cols-2',
            sectionReveal,
          )}
        >
          <SourceChart data={data?.sourceBreakdown ?? []} loading={isLoading} />
          <TopPropertiesList data={data?.topProperties ?? []} loading={isLoading} />
        </div>
      </div>
    </AdminPage>
  )
}
