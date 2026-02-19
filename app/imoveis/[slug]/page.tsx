import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { BedDouble, Bath, CarFront, Ruler, MapPin, Grid2X2 } from 'lucide-react'

import { MenubarHome } from '@/components/menu-home'
import Footer from '@/components/footer'
import { PropertyImagesCarousel } from '@/components/property-images-carousel'

import { RecommendedCarousel, RecommendedProperty } from '@/components/recommended-carousel'
import { getProperty, type Property } from '@/app/api/get-property'

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

interface PageProps {
  params: Promise<{ slug: string }>
}
export interface GetPropertiesResponse {
  properties: Properties[]
}

function parsePrice(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, "").replace(",", ".")
  return Number(cleaned) || 0
}

function buildPropertyJsonLd(property: Property) {
  const price = parsePrice(property.value)
  const images = property.files.map((f) => f.path)

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.name,
    description: property.summary,
    url: `https://aurosimobiliaria.com.br/imoveis/${property.slug}`,
    image: images,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.street
        ? `${property.street}, ${property.numberAddress}`
        : undefined,
      addressLocality: property.city,
      addressRegion: property.state || "SC",
      addressCountry: "BR",
      neighborhood: property.neighborhood,
    },
  }

  if (property.latitude && property.longitude) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: Number(property.latitude),
      longitude: Number(property.longitude),
    }
  }

  if (!property.priceOnRequest && price > 0) {
    jsonLd.offers = {
      "@type": "Offer",
      price,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
    }
  }

  return jsonLd
}

function buildBreadcrumbJsonLd(propertyName: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://aurosimobiliaria.com.br",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Imóveis",
        item: "https://aurosimobiliaria.com.br/imoveis",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: propertyName,
        item: `https://aurosimobiliaria.com.br/imoveis/${slug}`,
      },
    ],
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const property = await getProperty(slug)
  if (!property) return { title: 'Imóvel não encontrado' }

  const ogImage = property.files?.[0]?.path || "https://aurosimobiliaria.com.br/logo.png"

  return {
    title: `Auros | ${property.name}`,
    description: property.summary,
    alternates: { canonical: `https://aurosimobiliaria.com.br/imoveis/${property.slug}` },
    openGraph: {
      title: property.name,
      description: property.summary,
      url: `https://aurosimobiliaria.com.br/imoveis/${property.slug}`,
      type: "website",
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
      card: "summary_large_image",
      title: property.name,
      description: property.summary,
      images: [ogImage],
    },
  }
}

const getRecommendedProperties = unstable_cache(
  async (city: string, currentId: string): Promise<RecommendedProperty[]> => {
    try {
      const response = await api.get<GetPropertiesResponse>(`/imovel/todos?filter[city]=${encodeURIComponent(city)}&pageSize=5&visible=true`)
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
        bedrooms: prop.bedrooms,
        parkingSpots: prop.parkingSpots,
        totalArea: prop.totalArea,
        files: prop.files,
        suites: prop.suites,
        bathrooms: prop.bathrooms,
        privateArea: prop.privateArea,
        type_property: prop.type_property,

        coverImage: prop.files && prop.files.length > 0
          ? `${cloudFrontUrl}/${prop.files[0].fileName}`
          : undefined
      }))

    } catch (error) {
      console.error("Erro ao buscar recomendados:", error)
      return []
    }
  },
  ['recommended-properties'],
  { revalidate: 1800, tags: ['properties'] } // 30 minutos
)

interface FeatureItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>
  value: string | number
  label: string
  suffix?: string
}

const FeatureItem = ({ icon: Icon, value, label, suffix = "" }: FeatureItemProps) => {
  if (!Number(value)) return null
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 bg-[#17375F]/5 px-3 py-2 rounded-md">
            <Icon size={24} className="text-[#17375F]" />
            <span className="text-lg font-bold text-gray-700">{value}{suffix}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent><p>{label}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params
  const property = await getProperty(slug)

  if (!property) {
    notFound()
  }

  const realtors = property.realtors || []
  const recommended = await getRecommendedProperties(property.city, property.id)

  const propertyJsonLd = buildPropertyJsonLd(property)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(property.name, property.slug)

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

      <div className="max-w-[1200px] mx-auto p-4 space-y-8 py-8 md:py-12">

        <PropertyImagesCarousel
          files={property.files.map(file => ({
            id: file.id,
            path: file.path,
            fileName: file.fileName
          }))}
          propertyName={property.name}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Coluna Principal (Detalhes) */}
          <div className="md:col-span-8 space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">

                {/* Cabeçalho */}
                <div className="space-y-2 mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-[#17375F]">{property.name}</h1>
                  <div className="flex items-center justify-between text-gray-500 gap-1 flex-wrap">
                    <div className='flex items-center gap-2'>
                      <MapPin size={18} />
                      <span>{property.city} - {property.neighborhood}</span>
                      {property.street && (
                        <>
                          <span className="mx-1 hidden sm:inline">•</span>
                          <span className="hidden sm:inline">{property.street}, {property.numberAddress}</span>
                        </>
                      )}
                    </div>
                    <div>
                      <span className='text-xs bg-[#17375F] text-white px-4 py-1 rounded-full'>
                        Ref: {property.code || property.id.substring(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Features */}
                <div>
                  <h3 className="text-sm font-bold text-[#17375F] uppercase mb-4">Informações</h3>
                  <div className="flex flex-wrap gap-4">
                    <FeatureItem icon={BedDouble} value={property.bedrooms} label="Quartos" />
                    <FeatureItem icon={Bath} value={property.suites} label="Suítes" />
                    <FeatureItem icon={Bath} value={property.bathrooms} label="Banheiros" />
                    <FeatureItem icon={CarFront} value={property.parkingSpots} label="Vagas" />
                    <FeatureItem icon={Ruler} value={property.totalArea} label="Área Total" suffix=" m²" />
                    <FeatureItem icon={Grid2X2} value={property.privateArea} label="Área Privativa" suffix=" m²" />
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Descrição */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#17375F] uppercase">Sobre o imóvel</h3>
                  <p className="text-gray-600 italic border-l-4 border-[#17375F] pl-4">
                    {property.summary}
                  </p>

                  <PropertyDescription description={property.description} />
                </div>

                {(property.latitude && property.longitude) && (
                  <>
                    <Separator className='my-10' />
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-[#17375F] uppercase flex items-center gap-2">
                        <MapPin size={18} />
                        Localização
                      </h3>
                      <PropertyGoogleMap
                        lat={Number(property.latitude)}
                        lng={Number(property.longitude)}
                        popupText={property.name}
                        radius={500}
                      />
                      <p className="text-xs text-gray-400 text-center">
                        A localização no mapa é aproximada. Consulte o corretor para o endereço exato.
                      </p>
                    </div>
                  </>
                )}

              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral (Preço e Corretores) */}
          <div className="md:col-span-4 space-y-6">
            {/* Card de Valor */}
            <Card className="border-gray-200 shadow-sm sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <Badge variant="secondary" className={`text-lg px-4 py-1 ${property.transactionType === 'ALUGUEL' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#17375F]/10 text-[#17375F]'}`}>
                    {property.transactionType === 'ALUGUEL' ? 'Aluguel' : 'Venda'}
                  </Badge>
                  <span className="text-2xl font-bold text-[#17375F]">
                    {property.priceOnRequest
                      ? 'Sob consulta'
                      : property.pricePrefix
                        ? `Até ${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`
                        : `${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`}
                  </span>
                </div>

                {/* Lista de Corretores */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Corretores Responsáveis</h3>
                  {realtors.length > 0 ? (
                    <div className="space-y-4">
                      {realtors.map((realtor: Realtor) => (
                        <RealtorsCard
                          key={realtor.id}
                          realtor={realtor}
                          property={property}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4 border border-dashed rounded-md">
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