"use client"

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useWatermark } from '@/hooks/use-watermark'
import { WatermarkOverlay } from '@/components/watermark-overlay'
import { ChevronLeft, ChevronRight, BedDouble, Bath, CarFront, Ruler, LayoutGrid, Toilet, Grid2X2 } from 'lucide-react'

// UI Components
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export interface RecommendedProperty {
  id: string
  name: string
  slug: string
  value: string
  city: string
  neighborhood: string
  summary?: string
  bedrooms: string | number
  suites?: string | number
  bathrooms?: string | number
  parkingSpots: string | number
  totalArea: string | number
  privateArea?: string | number
  type_property?: { description: string }
  coverImage?: string
}

interface PropertyFeatureProps {
  icon: React.ComponentType<{ size: number, className?: string }>;
  value?: string | number;
  label: string;
  suffix?: string;
}

const PropertyFeature = ({ icon: Icon, value, label, suffix = "" }: PropertyFeatureProps) => {
  if (!value || value === '0' || value === 0) return null
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1 text-[#17375F] cursor-default bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100 whitespace-nowrap">
          <Icon size={16} className="text-[#17375F]" />
          <span className="font-bold text-xs">{value}{suffix}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent><p>{label}</p></TooltipContent>
    </Tooltip>
  )
}

export function RecommendedCarousel({ properties }: { properties: RecommendedProperty[] }) {
  const { watermarkUrl } = useWatermark()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (!properties || properties.length === 0) return null

  return (
    <TooltipProvider>
      <div className="space-y-6 py-8">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold text-[#17375F]">Imóveis Semelhantes em {properties[0].city}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll('left')} className="h-8 w-8 rounded-full border-zinc-200 text-[#17375F] hover:bg-[#17375F] hover:text-white">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll('right')} className="h-8 w-8 rounded-full border-zinc-200 text-[#17375F] hover:bg-[#17375F] hover:text-white">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {properties.map(property => {

            // Lista completa de features (igual à listagem principal)
            const featuresList = [
              { icon: BedDouble, value: property.bedrooms, label: "Quartos" },
              { icon: Bath, value: property.suites, label: "Suítes" },
              { icon: Toilet, value: property.bathrooms, label: "Banheiros" },
              { icon: CarFront, value: property.parkingSpots, label: "Vagas" },
              { icon: LayoutGrid, value: property.totalArea, label: "Área Total", suffix: " m²" },
              { icon: Grid2X2, value: property.privateArea, label: "Área Priv.", suffix: " m²" },
            ].filter(item => item.value && item.value !== '0' && item.value !== 0);

            return (
              <div
                key={property.id}
                className="min-w-[320px] max-w-[320px] snap-start"
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all shadow-none duration-300 border-zinc-200 py-0 flex flex-col bg-white group">

                  <Link href={`/imoveis/${property.slug}`} className="flex flex-col h-full hover:text-[#17375F] transition-colors">

                    {/* Imagem */}
                    <div className="relative h-[250px] w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {property.coverImage ? (
                        <>
                          <Image
                            src={property.coverImage}
                            alt={property.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 320px"
                          />
                          {watermarkUrl && <WatermarkOverlay watermarkUrl={watermarkUrl} />}
                        </>
                      ) : (
                        <div className="text-gray-400 text-sm">Sem imagem</div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    </div>

                    <CardHeader className="py-4">
                      <h3 className="text-base font-bold text-zinc-800 line-clamp-1" title={property.name}>
                        {property.name}
                      </h3>
                      <p className="text-xs text-zinc-500 line-clamp-1">
                        {property.city} - {property.neighborhood}
                      </p>
                      {/* Summary com altura fixa para alinhar cards */}
                      {/* <p className="text-sm text-zinc-600 line-clamp-2 mt-2 h-10">
                      {property.summary || ''}
                    </p> */}
                    </CardHeader>

                    {/* Carrossel de Features */}
                    {featuresList.length > 0 ? (
                      <CardContent className="w-full overflow-hidden py-4 m-0">
                        <p className="text-xs font-semibold text-zinc-900 mb-2">Informações</p>
                        <div className="flex gap-2 flex-wrap">
                          {featuresList.map((feature, index) => (
                            <PropertyFeature
                              key={index}
                              icon={feature.icon}
                              value={feature.value}
                              label={feature.label}
                              suffix={feature.suffix}
                            />
                          ))}
                        </div>
                      </CardContent>
                    ) : (
                      // Espaço vazio para alinhar se não tiver features
                      <div className="mt-auto h-[60px]" />
                    )}

                    <div className="mt-auto">
                      <CardFooter className="flex items-center justify-between border-t py-4 bg-gray-50/50">
                        <span className="text-xl font-bold text-[#17375F]">{property.value}</span>
                        <div className="flex gap-2">
                          <Badge className="bg-[#17375F] hover:bg-[#122b4a]">Venda</Badge>

                        </div>
                      </CardFooter>
                    </div>

                  </Link>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}