'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { RecentPropertiesGrid } from '@/components/recent-properties'
import { getRecentProperties } from '@/app/api/get-recent-properties'

interface RecentPropertiesSectionProps {
  agencyId?: string
}

export function RecentPropertiesSection({ agencyId }: RecentPropertiesSectionProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-properties', agencyId],
    queryFn: () => getRecentProperties(agencyId),
  })

  if (!isLoading && (!data?.properties || data.properties.length === 0)) return null

  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden bg-zinc-50 px-4 py-16">
      <div className="z-10 mb-10 text-center">
        <h2 className="text-2xl font-normal text-black">Propriedades</h2>
        <h2 className="text-2xl font-bold text-(--primary-color,#17375F)">Recentes</h2>
      </div>

      <RecentPropertiesGrid
        agencyId={agencyId}
        renderCTA={(hasData) =>
          hasData && (
            <Link href="/imoveis" className="mt-10">
              <Button
                variant="outline"
                size="lg"
                className="cursor-pointer bg-(--primary-color,#17375F) text-white hover:bg-(--primary-color,#17375F)/80 hover:text-white"
              >
                Ver todos os imóveis
              </Button>
            </Link>
          )
        }
      />
    </section>
  )
}
