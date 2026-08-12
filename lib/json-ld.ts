interface JsonLdPropertyInput {
  name: string
  summary: string
  slug: string
  street?: string
  numberAddress?: string
  city: string
  neighborhood: string
  state?: string
  latitude?: string
  longitude?: string
  priceOnRequest: boolean
  value: string
  files: { path: string }[]
}

function parsePrice(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.')
  return Number(cleaned) || 0
}

/** RealEstateListing JSON-LD for a single property page. */
export function buildPropertyJsonLd(property: JsonLdPropertyInput, baseUrl: string) {
  const price = parsePrice(property.value)
  const images = property.files.map((f) => f.path)

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.name,
    description: property.summary,
    url: `${baseUrl}/imoveis/${property.slug}`,
    image: images,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.street
        ? `${property.street}, ${property.numberAddress}`
        : undefined,
      addressLocality: property.city,
      addressRegion: property.state,
      addressCountry: 'BR',
      neighborhood: property.neighborhood,
    },
  }

  if (property.latitude && property.longitude) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: Number(property.latitude),
      longitude: Number(property.longitude),
    }
  }

  if (!property.priceOnRequest && price > 0) {
    jsonLd.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
    }
  }

  return jsonLd
}

interface BreadcrumbItem {
  name: string
  /** Path relative to baseUrl, e.g. "" for home or "/imoveis". */
  path: string
}

/** BreadcrumbList JSON-LD, shared by listing and detail pages. */
export function buildBreadcrumbJsonLd(baseUrl: string, items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  }
}

/** RealEstateAgent JSON-LD for tenants without hand-authored contact details. */
export function buildOrganizationJsonLd(name: string, url: string, logoUrl?: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name,
    url,
    ...(logoUrl ? { logo: logoUrl } : {}),
  }
}
