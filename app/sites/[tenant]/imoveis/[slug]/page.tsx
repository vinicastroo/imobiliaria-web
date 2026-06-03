import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { Metadata } from 'next'
import { BedDouble, Bath, CarFront, Ruler, Grid2X2, MapPin } from 'lucide-react'

import { getProperty } from '@/app/api/get-property'
import { MenubarHome } from '@/components/menu-home'
import { PropertyImagesCarousel } from '@/components/property-images-carousel'
import { PropertyDescription } from '@/components/property-description'
import { SiteFooter } from '@/components/site-templates/site-footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface PageProps {
  params: Promise<{ tenant: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const property = await getProperty(slug)

  if (!property) return { title: 'Imóvel não encontrado', robots: { index: false, follow: false } }

  return {
    title:       property.name,
    description: property.summary,
    openGraph: {
      title:       property.name,
      description: property.summary,
      images:      property.files[0] ? [{ url: property.files[0].path }] : [],
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
    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
      <Icon size={20} className="text-(--primary-color,#17375F)" />
      <span className="text-sm font-semibold text-gray-700">{value}{suffix}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  )
}

export default async function TenantPropertyPage({ params }: PageProps) {
  const { slug } = await params
  const property = await getProperty(slug)

  if (!property) notFound()
  if (property.visible === false) redirect('/')

  const agencyId = (await headers()).get('x-tenant-id') ?? process.env.NEXT_PUBLIC_AGENCY_ID ?? ''

  const priceDisplay = property.priceOnRequest
    ? 'Sob consulta'
    : property.pricePrefix
      ? `A partir de ${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`
      : `${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`

  return (
    <main className="min-h-screen bg-gray-50">
      <MenubarHome />

      <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-6">

        <PropertyImagesCarousel
          files={property.files.map(f => ({ id: f.id, path: f.path, fileName: f.fileName }))}
          propertyName={property.name}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main column */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
                    <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin size={14} />
                      {property.neighborhood}, {property.city} — {property.state}
                    </p>
                  </div>
                  <Badge className={property.transactionType === 'ALUGUEL' ? 'bg-emerald-600' : 'bg-(--primary-color,#17375F)'}>
                    {property.transactionType === 'ALUGUEL' ? 'Aluguel' : 'Venda'}
                  </Badge>
                </div>

                <Separator />

                <div className="flex flex-wrap gap-2">
                  <Feature icon={BedDouble} value={property.bedrooms}    label="Quartos" />
                  <Feature icon={Bath}     value={property.suites}       label="Suítes" />
                  <Feature icon={Bath}     value={property.bathrooms}    label="Banheiros" />
                  <Feature icon={CarFront} value={property.parkingSpots} label="Vagas" />
                  <Feature icon={Ruler}    value={property.totalArea}    label="Área total" suffix=" m²" />
                  <Feature icon={Grid2X2} value={property.privateArea}   label="Área priv." suffix=" m²" />
                </div>

                {property.summary && (
                  <>
                    <Separator />
                    <p className="text-gray-600 leading-relaxed">{property.summary}</p>
                  </>
                )}

                {property.description && (
                  <>
                    <Separator />
                    <PropertyDescription description={property.description} />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <p className="text-3xl font-bold text-(--primary-color,#17375F)">{priceDisplay}</p>
                <p className="text-xs text-gray-400">Cód. {property.code}</p>
                <Separator />
                <p className="text-sm text-gray-500">
                  Interessado neste imóvel? Entre em contato com nossos corretores.
                </p>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel ${property.name} (Cód. ${property.code}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-md px-4 py-3 text-white text-sm font-medium"
                  style={{ backgroundColor: 'var(--primary-color, #17375F)' }}
                >
                  Entrar em contato
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
