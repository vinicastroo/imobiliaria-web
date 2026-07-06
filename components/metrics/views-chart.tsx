"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TrendingUp } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DailyViews } from './types'

function formatDay(date: string, long = false): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: long ? 'long' : 'short',
  })
}

interface ViewsTooltipProps {
  active?: boolean
  payload?: { value?: number }[]
  label?: string | number
}

function ViewsTooltip({ active, payload, label }: ViewsTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-[0_4px_12px_rgba(16,24,40,0.08)]">
      <p className="text-[11px] text-gray-400">{formatDay(String(label), true)}</p>
      <p className="text-sm font-semibold text-gray-900">
        {payload[0].value?.toLocaleString('pt-BR')} visualizaç{payload[0].value === 1 ? 'ão' : 'ões'}
      </p>
    </div>
  )
}

interface ViewsChartProps {
  data: DailyViews[]
  loading?: boolean
}

export function ViewsChart({ data, loading }: ViewsChartProps) {
  const hasViews = data.some((d) => d.views > 0)

  return (
    <Card className="border-gray-200/80 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
      <CardHeader className="pb-0 pt-5">
        <CardTitle className="text-base font-semibold">Visualizações por dia</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <Skeleton className="h-56 w-full" />
        ) : !hasViews ? (
          <div className="flex h-56 flex-col items-center justify-center gap-2 text-gray-400">
            <TrendingUp size={20} className="text-gray-300" />
            <p className="text-sm">Nenhuma visualização no período</p>
          </div>
        ) : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f3f4f6" strokeWidth={1} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={32}
                  tickMargin={8}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={(value: string) => formatDay(value)}
                />
                <YAxis
                  width={36}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={(value: number) => value.toLocaleString('pt-BR')}
                />
                <Tooltip
                  content={<ViewsTooltip />}
                  cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#viewsGradient)"
                  activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: 'var(--primary)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
