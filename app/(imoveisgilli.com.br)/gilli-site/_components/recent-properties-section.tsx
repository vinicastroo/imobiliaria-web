import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RecentPropertiesGrid } from '@/components/recent-properties'
import { getRecentProperties } from '@/app/api/get-recent-properties'

interface RecentPropertiesSectionProps {
  agencyId?: string
}

export async function RecentPropertiesSection({ agencyId }: RecentPropertiesSectionProps) {
  let properties: Awaited<ReturnType<typeof getRecentProperties>>['properties'] = []
  try {
    const result = await getRecentProperties(agencyId)
    properties = result.properties
  } catch {
    return null
  }

  if (properties.length === 0) return null

  return (
    <section className="relative w-full py-16 px-4 bg-zinc-50 flex flex-col items-center overflow-hidden">
      <div className="text-center mb-10 z-10">
        <h2 className="text-2xl font-normal text-black">Propriedades</h2>
        <h2 className="text-2xl font-bold text-(--primary-color,#17375F)">Recentes</h2>
      </div>

      <RecentPropertiesGrid
        agencyId={agencyId}
        initialProperties={properties}
        renderCTA={(hasData) => hasData && (
          <Link href="/imoveis" className="mt-10">
            <Button variant="outline" size="lg" className="bg-(--primary-color,#17375F) text-white hover:bg-(--primary-color,#17375F)/80 hover:text-white cursor-pointer">
              Ver todos os imóveis
            </Button>
          </Link>
        )}
      />
    </section>
  )
}
