"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { SourceBreakdown } from './types'

const SOURCE_LABELS: Record<string, string> = {
  DIRECT: 'Direto',
  GOOGLE: 'Google',
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  WHATSAPP: 'WhatsApp',
  OTHER: 'Outros',
}

const COLORS = ['#3b82f6', '#ef4444', '#f97316', '#8b5cf6', '#22c55e', '#6b7280']

interface SourceChartProps {
  data: SourceBreakdown[]
  loading?: boolean
}

export function SourceChart({ data, loading }: SourceChartProps) {
  const chartData = data.map((item) => ({
    name: SOURCE_LABELS[item.source] ?? item.source,
    value: item.count,
  }))

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Origem do Acesso</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Skeleton className="h-40 w-40 rounded-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex justify-center items-center h-48 text-sm text-gray-400">
            Nenhum dado ainda
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{ borderRadius: '8px', fontSize: '13px' }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
