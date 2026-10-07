import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import { BedDouble, Bath, CarFront, Ruler, Grid2X2, MapPin, ChevronRight } from 'lucide-react'
import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr'

import api from '@/services/api'
import { getPropertyForPage } from '@/lib/property-page'
import type { Properties } from '@/app/api/get-properties'
import { PropertyViewTracker } from '@/components/property-view-tracker'
import { buildBreadcrumbJsonLd, buildPropertyJsonLd } from '@/lib/json-ld'
import { MenubarHome } from '@/components/menu-home'
import { PropertyImagesCarousel } from '@/components/property-images-carousel'
import { PropertyDescription } from '@/components/property-description'
import { RecommendedCarousel, type RecommendedProperty } from '@/components/recommended-carousel'
import PropertyGoogleMap from '@/components/property-google-map'
import { SiteFooter } from '@/components/site-templates/site-footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface PageProps {
  params: Promise<{ tenant: string; slug: string }>
}

// agencyId is the first parameter so Next.js scopes the cache per tenant
const getRecommendedProperties = unstable_cache(
  async (agencyId: string, city: string, currentId: string): Promise<RecommendedProperty[]> => {
    try {
      const response = await api.get<{ properties: Properties[] }>(
        `/imovel/todos?filter[city]=${encodeURIComponent(city)}&pageSize=5&visible=true`,
        { headers: { 'x-agency-id': agencyId } },
      )
      const properties = response.data.properties ?? []

      return properties
        .filter((prop) => prop.id !== currentId)
        .map((prop) => ({
          id: prop.id,
          name: prop.name,
          slug: prop.slug,
          value: prop.value,
          priceOnRequest: prop.priceOnRequest,
          pricePrefix: prop.pricePrefix,
          transactionType: prop.transactionType,
          city: prop.city,
          neighborhood: prop.neighborhood,
          summary: prop.summary,
          bedrooms: prop.bedrooms,
          suites: prop.suites,
          bathrooms: prop.bathrooms,
          parkingSpots: prop.parkingSpots,
          totalArea: prop.totalArea,
          privateArea: prop.privateArea,
          type_property: prop.type_property,
          coverImage: prop.files[0]?.path,
        }))
    } catch {
      return []
    }
  },
  ['tenant-recommended-properties'],
  { revalidate: 1800, tags: ['properties'] },
)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  const property = await getPropertyForPage(slug)

  const host = (await headers()).get('host')?.split(':')[0] ?? ''

  return {
    title: property.name,
    description: property.summary,
    alternates: { canonical: `https://${host}/imoveis/${property.slug}` },
    openGraph: {
      title: property.name,
      description: property.summary,
      url: `https://${host}/imoveis/${property.slug}`,
      images: property.files[0] ? [{ url: property.files[0].path }] : [],
    },
  }
}

interface FeatureProps {
  icon: React.ComponentType<{ size?: number; className?: string }>
  value: string | number
  label: string
  suffix?: string
}

function Feature({ icon: Icon, value, label, suffix = '' }: FeatureProps) {
  if (!value || value === '0') return null
  return (
    <div className="flex items-center gap-2 rounded-md border border-gray-100 bg-gray-50 px-3 py-2">
      <Icon size={20} className="text-(--primary-color,#17375F)" />
      <span className="text-sm font-semibold text-gray-700">
        {value}
        {suffix}
      </span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  )
}

export default async function TenantPropertyPage({ params }: PageProps) {
  const { slug } = await params

  const property = await getPropertyForPage(slug)

  const headersList = await headers()
  const agencyId = headersList.get('x-tenant-id') ?? process.env.NEXT_PUBLIC_AGENCY_ID ?? ''
  const host = headersList.get('host')?.split(':')[0] ?? ''

  const recommended = await getRecommendedProperties(agencyId, property.city, property.id)

  const priceDisplay = property.priceOnRequest
    ? 'Sob consulta'
    : property.pricePrefix
      ? `A partir de ${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`
      : `${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`

  const realtor = property.realtors?.[0]
  const hasLocation = Boolean(property.latitude && property.longitude)

  const baseUrl = `https://${host}`
  const propertyJsonLd = buildPropertyJsonLd(property, baseUrl)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(baseUrl, [
    { name: 'Home', path: '' },
    { name: 'Imóveis', path: '/imoveis' },
    { name: property.name, path: `/imoveis/${property.slug}` },
  ])

  return (
    <main className="flex min-h-[100dvh] flex-col bg-gray-50">
      <PropertyViewTracker propertyId={property.id} slug={property.slug} agencyId={agencyId} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <MenubarHome />

      <div className="mx-auto w-full max-w-[1200px] flex-1 space-y-6 px-4 py-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500">
          <Link href="/" className="transition-colors hover:text-gray-900">
            Início
          </Link>
          <ChevronRight size={14} className="shrink-0" />
          <Link href="/imoveis" className="transition-colors hover:text-gray-900">
            Imóveis
          </Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="line-clamp-1 text-gray-700">{property.name}</span>
        </nav>

        <PropertyImagesCarousel
          files={property.files.map((f) => ({ id: f.id, path: f.path, fileName: f.fileName }))}
          propertyName={property.name}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
                    <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                      <MapPin size={14} />
                      {property.neighborhood}, {property.city} - {property.state}
                    </p>
                  </div>
                  <Badge
                    className={
                      property.transactionType === 'ALUGUEL'
                        ? 'bg-emerald-600'
                        : 'bg-(--primary-color,#17375F)'
                    }
                  >
                    {property.transactionType === 'ALUGUEL' ? 'Aluguel' : 'Venda'}
                  </Badge>
                </div>

                <Separator />

                <div className="flex flex-wrap gap-2">
                  <Feature icon={BedDouble} value={property.bedrooms} label="Quartos" />
                  <Feature icon={Bath} value={property.suites} label="Suítes" />
                  <Feature icon={Bath} value={property.bathrooms} label="Banheiros" />
                  <Feature icon={CarFront} value={property.parkingSpots} label="Vagas" />
                  <Feature
                    icon={Ruler}
                    value={property.totalArea}
                    label="Área total"
                    suffix=" m²"
                  />
                  <Feature
                    icon={Grid2X2}
                    value={property.privateArea}
                    label="Área priv."
                    suffix=" m²"
                  />
                </div>

                {property.summary && (
                  <>
                    <Separator />
                    <p className="leading-relaxed text-gray-600">{property.summary}</p>
                  </>
                )}

                {property.description && (
                  <>
                    <Separator />
                    <PropertyDescription description={property.description} />
                  </>
                )}

                {hasLocation && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h2 className="flex items-center gap-2 text-sm font-bold text-(--primary-color,#17375F) uppercase">
                        <MapPin size={18} />
                        Localização
                      </h2>
                      <PropertyGoogleMap
                        lat={Number(property.latitude)}
                        lng={Number(property.longitude)}
                        popupText={property.name}
                        radius={500}
                      />
                      <p className="text-center text-xs text-gray-400">
                        A localização no mapa é aproximada. Consulte o corretor para o endereço
                        exato.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="sticky top-24">
              <CardContent className="space-y-4 p-6">
                <p className="text-3xl font-bold text-(--primary-color,#17375F)">{priceDisplay}</p>
                <p className="text-xs text-gray-400">Cód. {property.code}</p>
                <Separator />

                {realtor ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border border-gray-200">
                        <AvatarImage src={realtor.avatar} alt={realtor.name} />
                        <AvatarFallback>{realtor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{realtor.name}</p>
                        {realtor.creci && (
                          <p className="text-xs text-gray-500">CRECI {realtor.creci}</p>
                        )}
                      </div>
                    </div>
                    <a
                      href={`https://api.whatsapp.com/send?phone=${realtor.phone}&text=${encodeURIComponent(
                        `Olá! Tenho interesse no imóvel ${property.name} (Cód. ${property.code}).`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 motion-safe:active:scale-[0.97]"
                    >
                      <WhatsappLogo size={20} weight="fill" />
                      Falar no WhatsApp
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Interessado neste imóvel? Entre em contato com nossos corretores.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {recommended.length > 0 && <RecommendedCarousel properties={recommended} />}
      </div>

      <SiteFooter />
    </main>
  )
}
