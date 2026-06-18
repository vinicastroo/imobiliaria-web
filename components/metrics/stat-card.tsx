import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  loading?: boolean
}

export function StatCard({ title, value, subtitle, loading }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {loading ? (
          <Skeleton className="h-8 w-24 mt-2" />
        ) : (
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        )}
        {subtitle && <p className="text-xs text-gray-400 mt-1 truncate">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
