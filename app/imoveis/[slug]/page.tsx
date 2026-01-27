import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BedDouble, Bath, CarFront, Ruler, MapPin, } from 'lucide-react'

import { MenubarHome } from '@/components/menu-home'
import Footer from '@/components/footer'
import { PropertyGallery } from '@/components/property-gallery'
// REMOVIDO: import { getRealtorsForCity } from '@/data/realtors' 
import { getProperty } from '@/app/api/get-property'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import PropertyGoogleMap from '@/components/property-google-map'
import { RealtorsCard } from './realtors-card'
import type { Realtor } from '@/data/realtors'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const property = await getProperty(slug)
  if (!property) return { title: 'Imóvel não encontrado' }
  return {
    title: `Auros | ${property.name}`,
    description: property.summary,
    alternates: { canonical: `https://aurosimobiliaria.com.br/imoveis/${property.slug}` },
    openGraph: { images: property.files?.[0]?.path || "https://www.aurosimobiliaria.com.br/logo.png" }
  }
}

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
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md">
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

  // A API já retorna os corretores vinculados dentro de property.realtors
  // Garantimos que seja um array, caso venha null
  const realtors = property.realtors || []

  return (
    <main className="min-h-screen bg-white">
      <MenubarHome />

      <div className="max-w-[1200px] mx-auto p-4 space-y-8 py-20">

        {/* Galeria */}
        <PropertyGallery items={property.files.map(file => ({
          id: file.id,
          img: file.path,
          fileName: file.fileName
        }))} propertyName={property.name} />

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
                      {/* Exibe o Code se existir, senão exibe ID parcial */}
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
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Descrição */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#17375F] uppercase">Sobre o imóvel</h3>
                  <p className="text-gray-600 italic border-l-4 border-[#17375F] pl-4">
                    {property.summary}
                  </p>

                  <div
                    className="prose prose-slate max-w-none prose-headings:text-[#17375F] prose-a:text-blue-600 prose-li:marker:text-[#17375F]"
                    dangerouslySetInnerHTML={{ __html: property.description }}
                  />
                </div>

                {(property.latitude && property.longitude) && (
                  <>
                    <Separator className="my-6" />
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
                  <Badge variant="secondary" className="text-lg px-4 py-1 bg-[#17375F]/10 text-[#17375F]">
                    Venda
                  </Badge>
                  <span className="text-2xl font-bold text-[#17375F]">{property.value}</span>
                </div>

                {/* Lista de Corretores vindo da API */}
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
                    // Fallback opcional caso não tenha corretor vinculado
                    <div className="text-sm text-gray-500 text-center py-4 border border-dashed rounded-md">
                      Entre em contato com a imobiliária.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}