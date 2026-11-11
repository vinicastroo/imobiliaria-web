import { headers } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getProperties } from '@/app/api/get-properties'
import {
  parsePropertySearch,
  propertyQueryKey,
  type PropertySearchParams,
} from '@/lib/property-search'
import { PropertyList } from '@/components/property-list'

// Chave inclui agencyId, página e filtros; invalidado pelo admin (tag 'properties').
const getCachedProperties = unstable_cache(
  async (agencyId: string, page: number, filters: Parameters<typeof getProperties>[0]) =>
    getProperties({ page, ...filters }, agencyId),
  ['property-list-v1'],
  { revalidate: 86400, tags: ['properties'] },
)

export async function PropertyListServer({
  searchParams,
}: {
  searchParams: Promise<PropertySearchParams>
}) {
  const { page, filters, validPage } = parsePropertySearch(await searchParams)
  if (!validPage) notFound()
  const agencyId = (await headers()).get('x-tenant-id') ?? process.env.NEXT_PUBLIC_AGENCY_ID
  if (!agencyId) throw new Error('Missing agency context for property listing')
  const data = await getCachedProperties(agencyId, page, filters)
  if (page > Math.max(1, data.totalPages)) notFound()
  const queryClient = new QueryClient()
  queryClient.setQueryData(propertyQueryKey(page, filters), data)
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PropertyList />
    </HydrationBoundary>
  )
}
