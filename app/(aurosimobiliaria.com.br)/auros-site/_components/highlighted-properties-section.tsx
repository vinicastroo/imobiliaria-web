import { HighlightedPropertiesGrid } from '@/components/highlighted-properties'
import { getHighlightedProperties } from '@/app/api/get-highlighted-properties'
import square from '@/public/square.svg'

interface HighlightedPropertiesSectionProps {
  agencyId?: string
}

export async function HighlightedPropertiesSection({ agencyId }: HighlightedPropertiesSectionProps) {
  let properties: Awaited<ReturnType<typeof getHighlightedProperties>>['properties'] = []
  try {
    const result = await getHighlightedProperties(agencyId)
    properties = result.properties
  } catch {
    return null
  }

  if (properties.length === 0) return null

  return (
    <section className="relative w-full py-16 px-4 bg-zinc-50 flex flex-col items-center overflow-hidden">
      <div
        className="absolute inset-0 -top-20 -left-20 opacity-40 pointer-events-none"
        style={{ backgroundImage: `url(${square.src})`, backgroundRepeat: 'no-repeat' }}
      />

      <div className="text-center mb-10 z-10">
        <h2 className="text-2xl font-normal text-black">Imóveis em</h2>
        <h2 className="text-2xl font-bold text-(--primary-color,#17375F)">Destaque</h2>
      </div>

      <HighlightedPropertiesGrid agencyId={agencyId} initialProperties={properties} />
    </section>
  )
}
