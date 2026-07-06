import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  loading?: boolean
}

export function StatCard({ title, value, subtitle, icon: Icon, loading }: StatCardProps) {
  return (
    <Card className="border-gray-200/80 shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(16,24,40,0.09)]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{title}</p>
            {loading ? (
              <Skeleton className="mt-2 h-8 w-24" />
            ) : (
              <p className="mt-1.5 truncate text-3xl font-bold tracking-tight text-gray-900">
                {value}
              </p>
            )}
            {subtitle && !loading && (
              <p className="mt-1 truncate text-xs text-gray-400">{subtitle}</p>
            )}
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/10">
            <Icon size={18} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
