export type PropertySearchParams = Record<string, string | string[] | undefined>

const filterKeys = {
  type: 'tipoImovel',
  city: 'cidade',
  neighborhood: 'bairro',
  bedrooms: 'quartos',
  bathrooms: 'banheiros',
  suites: 'suites',
  parkingSpots: 'garagem',
  totalArea: 'areaTotal',
  privateArea: 'areaTerreno',
  code: 'ref',
} as const

export function parsePropertySearch(params: PropertySearchParams) {
  const first = (key: string) => {
    const value = params[key]
    return (Array.isArray(value) ? value[0] : value) || null
  }
  const rawPage = first('page')
  const page = rawPage === null ? 1 : Number(rawPage)
  const filters = Object.fromEntries(
    Object.entries(filterKeys).map(([key, param]) => [key, first(param)]),
  ) as Record<keyof typeof filterKeys, string | null>
  return { page, filters, validPage: Number.isSafeInteger(page) && page > 0 }
}

export function propertyQueryKey(
  page: number,
  filters: ReturnType<typeof parsePropertySearch>['filters'],
) {
  return [
    'properties',
    page,
    ...Object.keys(filterKeys).map((key) => filters[key as keyof typeof filters]),
  ]
}

export function propertyListingUrl(origin: string, params: PropertySearchParams) {
  const { page, filters, validPage } = parsePropertySearch(params)
  const url = new URL('/imoveis', origin)
  for (const [key, param] of Object.entries(filterKeys)) {
    if (filters[key]) url.searchParams.set(param, filters[key])
  }
  if (validPage && page > 1) url.searchParams.set('page', String(page))
  return url.toString()
}
