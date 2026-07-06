"use client"

import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Globe } from 'lucide-react'
import {
  FacebookLogo,
  GlobeSimple,
  GoogleLogo,
  InstagramLogo,
  LinkSimple,
  WhatsappLogo,
  type Icon,
} from '@phosphor-icons/react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { SourceBreakdown } from './types'

const SOURCE_LABELS: Record<string, string> = {
  DIRECT: 'Direto',
  GOOGLE: 'Google',
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  WHATSAPP: 'WhatsApp',
  OTHER: 'Outros',
}

// Paleta categórica validada (CVD-safe); cor fixa por fonte, "Outros" em cinza neutro
const SOURCE_COLORS: Record<string, string> = {
  DIRECT: '#2a78d6',
  GOOGLE: '#1baf7a',
  FACEBOOK: '#eda100',
  INSTAGRAM: '#008300',
  WHATSAPP: '#4a3aa7',
  OTHER: '#94a3b8',
}

const SOURCE_ICONS: Record<string, Icon> = {
  DIRECT: LinkSimple,
  GOOGLE: GoogleLogo,
  FACEBOOK: FacebookLogo,
  INSTAGRAM: InstagramLogo,
  WHATSAPP: WhatsappLogo,
  OTHER: GlobeSimple,
}

interface SourceChartProps {
  data: SourceBreakdown[]
  loading?: boolean
}

export function SourceChart({ data, loading }: SourceChartProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const total = data.reduce((sum, item) => sum + item.count, 0)

  const chartData = data.map((item) => ({
    source: item.source,
    name: SOURCE_LABELS[item.source] ?? item.source,
    value: item.count,
    color: SOURCE_COLORS[item.source] ?? SOURCE_COLORS.OTHER,
    icon: SOURCE_ICONS[item.source] ?? SOURCE_ICONS.OTHER,
  }))

  const hoveredEntry = chartData.find((entry) => entry.source === hovered)

  return (
    <Card className="h-full border-gray-200/80 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
      <CardHeader className="pb-2 pt-5">
        <CardTitle className="text-base font-semibold">Origem do Acesso</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <div className="flex h-52 items-center justify-center">
            <Skeleton className="h-40 w-40 rounded-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-52 flex-col items-center justify-center gap-2 text-gray-400">
            <Globe size={20} className="text-gray-300" />
            <p className="text-sm">Nenhum dado ainda</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
            <div className="relative h-52 w-52 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={64}
                    outerRadius={90}
                    cornerRadius={4}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={2}
                    onMouseEnter={(_, index) => setHovered(chartData[index]?.source ?? null)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.source}
                        fill={entry.color}
                        fillOpacity={hovered && hovered !== entry.source ? 0.25 : 1}
                        style={{ transition: 'fill-opacity 150ms ease', outline: 'none' }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                {hoveredEntry ? (
                  <>
                    <p className="text-2xl font-bold tracking-tight text-gray-900">
                      {total ? Math.round((hoveredEntry.value / total) * 100) : 0}%
                    </p>
                    <p className="max-w-[100px] truncate text-[11px] text-gray-400">{hoveredEntry.name}</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold tracking-tight text-gray-900">
                      {total.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-[11px] text-gray-400">acessos</p>
                  </>
                )}
              </div>
            </div>

            <ul className="w-full min-w-0 flex-1 space-y-0.5">
              {chartData.map((entry) => (
                <li
                  key={entry.source}
                  onMouseEnter={() => setHovered(entry.source)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    'flex cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors',
                    hovered === entry.source ? 'bg-gray-50' : hovered ? 'opacity-50' : '',
                  )}
                >
                  <entry.icon size={15} weight="bold" className="shrink-0" style={{ color: entry.color }} />
                  <span className="truncate text-gray-600">{entry.name}</span>
                  <span className="ml-auto font-semibold tabular-nums text-gray-900">
                    {entry.value.toLocaleString('pt-BR')}
                  </span>
                  <span className="w-9 text-right tabular-nums text-gray-400">
                    {total ? Math.round((entry.value / total) * 100) : 0}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
