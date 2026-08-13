import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import { BedDouble, Bath, CarFront, Ruler, MapPin, Grid2X2 } from 'lucide-react'

import { MenubarHome } from '@/components/menu-home'
import Footer from '../../_components/footer'
import { PropertyImagesCarousel } from '@/components/property-images-carousel'

import { RecommendedCarousel, RecommendedProperty } from '@/components/recommended-carousel'
import { getProperty } from '@/app/api/get-property'
import { buildBreadcrumbJsonLd, buildPropertyJsonLd } from '@/lib/json-ld'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import PropertyGoogleMap from '@/components/property-google-map'
import { RealtorsCard } from './realtors-card'
import type { Realtor } from '@/data/realtors'
import api from '@/services/api'
import type { Properties } from '@/app/api/get-properties'
import RentJourney from '@/components/rent-journet'
import { CopyLinkButton } from '@/components/copy-link-button'
import { PropertyDescription } from '@/components/property-description'
import { trackView } from '@/lib/track-view'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface PageProps {
  params: Promise<{ slug: string }>
}
export interface GetPropertiesResponse {
  properties: Properties[]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  if (UUID_RE.test(slug)) return { robots: { index: false, follow: false } }

  const property = await getProperty(slug)

  if (!property || property.visible === false) {
    return { title: 'Imóvel indisponível' }
  }

  const ogImage = property.files?.[0]?.path || 'https://aurosimobiliaria.com.br/logo.png'

  return {
    title: `Auros | ${property.name}`,
    description: property.summary,
    alternates: { canonical: `https://aurosimobiliaria.com.br/imoveis/${property.slug}` },
    openGraph: {
      title: property.name,
      description: property.summary,
      url: `https://aurosimobiliaria.com.br/imoveis/${property.slug}`,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: property.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: property.name,
      description: property.summary,
      images: [ogImage],
    },
  }
}

// agencyId is the first parameter so Next.js scopes the cache per tenant
const getRecommendedProperties = unstable_cache(
  async (agencyId: string, city: string, currentId: string): Promise<RecommendedProperty[]> => {
    try {
      const response = await api.get<GetPropertiesResponse>(
        `/imovel/todos?filter[city]=${encodeURIComponent(city)}&pageSize=5&visible=true`,
        {
          headers: { 'x-agency-id': agencyId },
        },
      )
      const data = response.data
      const allProperties = data.properties || []
      const filtered = allProperties.filter((p: Properties) => p.id !== currentId)
      const cloudFrontUrl = `https://d2wss3tmei5yh1.cloudfront.net`

      return filtered.map((prop: Properties) => ({
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
        parkingSpots: prop.parkingSpots,
        totalArea: prop.totalArea,
        files: prop.files,
        suites: prop.suites,
        bathrooms: prop.bathrooms,
        privateArea: prop.privateArea,
        type_property: prop.type_property,
        applyWatermark: prop.applyWatermark,

        coverImage:
          prop.files && prop.files.length > 0
            ? `${cloudFrontUrl}/${prop.files[0].fileName}`
            : undefined,
      }))
    } catch (error) {
      console.error('Erro ao buscar recomendados:', error)
      return []
    }
  },
  ['recommended-properties'],
  { revalidate: 1800, tags: ['properties'] }, // 30 minutos
)

interface FeatureItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>
  value: string | number
  label: string
  suffix?: string
}

const FeatureItem = ({ icon: Icon, value, label, suffix = '' }: FeatureItemProps) => {
  if (!Number(value)) return null
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 rounded-md bg-[#17375F]/5 px-3 py-2">
            <Icon size={24} className="text-[#17375F]" />
            <span className="text-lg font-bold text-gray-700">
              {value}
              {suffix}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params

  if (UUID_RE.test(slug)) {
    const property = await getProperty(slug)
    if (property?.slug) redirect(`/imoveis/${property.slug}`)
    notFound()
  }

  const property = await getProperty(slug)

  if (!property) {
    notFound()
  }

  if (property.visible === false) {
    notFound()
  }

  const headersList = await headers()
  const agencyId = headersList.get('x-tenant-id') ?? process.env.NEXT_PUBLIC_AGENCY_ID ?? ''

  trackView(slug, agencyId, headersList.get('referer'))

  const realtors = property.realtors || []
  const recommended = await getRecommendedProperties(agencyId, property.city, property.id)

  const baseUrl = 'https://aurosimobiliaria.com.br'
  const propertyJsonLd = buildPropertyJsonLd(property, baseUrl)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(baseUrl, [
    { name: 'Home', path: '' },
    { name: 'Imóveis', path: '/imoveis' },
    { name: property.name, path: `/imoveis/${property.slug}` },
  ])

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <MenubarHome />

      <div className="mx-auto max-w-[1200px] space-y-8 p-4 py-8 md:py-12">
        <PropertyImagesCarousel
          files={property.files.map((file) => ({
            id: file.id,
            path: file.path,
            fileName: file.fileName,
          }))}
          propertyName={property.name}
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Coluna Principal (Detalhes) */}
          <div className="space-y-6 md:col-span-8">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                {/* Cabeçalho */}
                <div className="mb-6 space-y-2">
                  <h1 className="text-3xl font-bold text-[#17375F] md:text-4xl">{property.name}</h1>
                  <div className="flex flex-wrap items-center justify-between gap-1 text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      <span>
                        {property.city} - {property.neighborhood}
                      </span>
                      {property.street && (
                        <>
                          <span className="mx-1 hidden sm:inline">•</span>
                          <span className="hidden sm:inline">
                            {property.street}, {property.numberAddress}
                          </span>
                        </>
                      )}
                    </div>
                    <div>
                      <span className="rounded-full bg-[#17375F] px-4 py-1 text-xs text-white">
                        Ref: {property.code || property.id.substring(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Features */}
                <div>
                  <h2 className="mb-4 text-sm font-bold text-[#17375F] uppercase">Informações</h2>
                  <div className="flex flex-wrap gap-4">
                    <FeatureItem icon={BedDouble} value={property.bedrooms} label="Quartos" />
                    <FeatureItem icon={Bath} value={property.suites} label="Suítes" />
                    <FeatureItem icon={Bath} value={property.bathrooms} label="Banheiros" />
                    <FeatureItem icon={CarFront} value={property.parkingSpots} label="Vagas" />
                    <FeatureItem
                      icon={Ruler}
                      value={property.totalArea}
                      label="Área Total"
                      suffix=" m²"
                    />
                    <FeatureItem
                      icon={Grid2X2}
                      value={property.privateArea}
                      label="Área Privativa"
                      suffix=" m²"
                    />
                  </div>
                </div>

                {property.property_infrastructures?.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h2 className="mb-4 text-sm font-bold text-[#17375F] uppercase">
                        Infraestrutura
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {property.property_infrastructures.map(({ infrastructure }) => (
                          <Badge
                            key={infrastructure.id}
                            variant="secondary"
                            className="px-3 py-1 text-xs"
                          >
                            {infrastructure.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator className="my-6" />

                {/* Descrição */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-[#17375F] uppercase">Sobre o imóvel</h2>
                  <p className="border-l-4 border-[#17375F] pl-4 text-gray-600 italic">
                    {property.summary}
                  </p>

                  <PropertyDescription description={property.description} />
                </div>

                {property.latitude && property.longitude && (
                  <>
                    <Separator className="my-10" />
                    <div className="space-y-4">
                      <h2 className="flex items-center gap-2 text-sm font-bold text-[#17375F] uppercase">
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

          {/* Coluna Lateral (Preço e Corretores) */}
          <div className="space-y-6 md:col-span-4">
            {/* Card de Valor */}
            <Card className="sticky top-4 border-gray-200 shadow-sm">
              <CardContent className="space-y-6 p-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <Badge
                    variant="secondary"
                    className={`px-4 py-1 text-lg ${property.transactionType === 'ALUGUEL' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#17375F]/10 text-[#17375F]'}`}
                  >
                    {property.transactionType === 'ALUGUEL' ? 'Aluguel' : 'Venda'}
                  </Badge>
                  <span className="text-2xl font-bold text-[#17375F]">
                    {property.priceOnRequest
                      ? 'Sob consulta'
                      : property.pricePrefix
                        ? `A partir de ${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`
                        : `${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`}
                  </span>
                </div>

                {/* Lista de Corretores */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase">
                    Corretores Responsáveis
                  </h3>
                  {realtors.length > 0 ? (
                    <div className="space-y-4">
                      {realtors.map((realtor: Realtor) => (
                        <RealtorsCard key={realtor.id} realtor={realtor} property={property} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border border-dashed py-4 text-center text-sm text-gray-500">
                      Entre em contato com a imobiliária.
                    </div>
                  )}
                </div>

                <CopyLinkButton />
              </CardContent>
            </Card>
          </div>
        </div>

        {recommended.length > 0 && (
          <div className="mt-12">
            <RentJourney />
            <RecommendedCarousel properties={recommended} />
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
