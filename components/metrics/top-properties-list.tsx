import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TopProperty } from './types'

interface TopPropertiesListProps {
  data: TopProperty[]
  loading?: boolean
}

export function TopPropertiesList({ data, loading }: TopPropertiesListProps) {
  const max = data[0]?.views ?? 1

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Imóveis Mais Vistos</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">Nenhum dado ainda</p>
        ) : (
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-gray-400 w-4">{index + 1}</span>
                    <span className="text-sm text-gray-700 truncate">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 ml-2 shrink-0">
                    {item.views}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.round((item.views / max) * 100)}%` }}
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
