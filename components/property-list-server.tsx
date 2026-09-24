import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getProperties } from '@/app/api/get-properties'
import {
  parsePropertySearch,
  propertyQueryKey,
  type PropertySearchParams,
} from '@/lib/property-search'
import { PropertyList } from '@/components/property-list'

export async function PropertyListServer({
  searchParams,
}: {
  searchParams: Promise<PropertySearchParams>
}) {
  const { page, filters, validPage } = parsePropertySearch(await searchParams)
  if (!validPage) notFound()
  const agencyId = (await headers()).get('x-tenant-id') ?? process.env.NEXT_PUBLIC_AGENCY_ID
  if (!agencyId) throw new Error('Missing agency context for property listing')
  const data = await getProperties({ page, ...filters }, agencyId)
  if (page > Math.max(1, data.totalPages)) notFound()
  const queryClient = new QueryClient()
  queryClient.setQueryData(propertyQueryKey(page, filters), data)
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PropertyList />
    </HydrationBoundary>
  )
}
