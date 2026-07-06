import { Flame } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { TopProperty } from './types'

interface TopPropertiesListProps {
  data: TopProperty[]
  loading?: boolean
}

export function TopPropertiesList({ data, loading }: TopPropertiesListProps) {
  const max = data[0]?.views ?? 1

  return (
    <Card className="h-full border-gray-200/80 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
      <CardHeader className="pb-2 pt-5">
        <CardTitle className="text-base font-semibold">Imóveis Mais Vistos</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-52 flex-col items-center justify-center gap-2 text-gray-400">
            <Flame size={20} className="text-gray-300" />
            <p className="text-sm">Nenhum dado ainda</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {data.map((item, index) => (
              <div
                key={item.id}
                className="group rounded-lg px-2 py-2 transition-colors hover:bg-gray-50"
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold transition-colors',
                        index === 0
                          ? 'bg-primary text-primary-foreground'
                          : index < 3
                            ? 'bg-primary/10 text-primary'
                            : 'bg-gray-100 text-gray-400',
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="truncate text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-gray-900">
                    {item.views.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="ml-[30px] h-1.5 overflow-hidden rounded-r-full bg-primary/[0.08]">
                  <div
                    className="h-full rounded-r-full bg-primary/80 transition-all duration-500 group-hover:bg-primary"
                    style={{ width: `${Math.max(Math.round((item.views / max) * 100), 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
