'use client'

import { useQuery } from '@tanstack/react-query'
import { HighlightedPropertiesGrid } from '@/components/highlighted-properties'
import { getHighlightedProperties } from '@/app/api/get-highlighted-properties'
import square from '@/public/square.svg'

interface HighlightedPropertiesSectionProps {
  agencyId?: string
}

export function HighlightedPropertiesSection({ agencyId }: HighlightedPropertiesSectionProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['highlighted-properties', agencyId],
    queryFn: () => getHighlightedProperties(agencyId),
  })

  if (!isLoading && (!data?.properties || data.properties.length === 0)) return null

  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden bg-zinc-50 px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 -top-20 -left-20 opacity-40"
        style={{ backgroundImage: `url(${square.src})`, backgroundRepeat: 'no-repeat' }}
      />

      <div className="z-10 mb-10 text-center">
        <h2 className="text-2xl font-normal text-black">Imóveis em</h2>
        <h2 className="text-2xl font-bold text-(--primary-color,#17375F)">Destaque</h2>
      </div>

      <HighlightedPropertiesGrid agencyId={agencyId} />
    </section>
  )
}
