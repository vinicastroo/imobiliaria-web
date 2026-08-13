'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Bath,
  CarFront,
  Ruler,
  LayoutGrid,
  Toilet,
  Grid2X2,
} from 'lucide-react'

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
  priceOnRequest: boolean
  pricePrefix: boolean
  transactionType: 'VENDA' | 'ALUGUEL'
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
  applyWatermark?: boolean
}

interface PropertyFeatureProps {
  icon: React.ComponentType<{ size: number; className?: string }>
  value?: string | number
  label: string
  suffix?: string
}

const PropertyFeature = ({ icon: Icon, value, label, suffix = '' }: PropertyFeatureProps) => {
  if (!value || value === '0' || value === 0) return null
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex cursor-default items-center gap-1 rounded-md border border-zinc-100 bg-zinc-50 px-2 py-1 whitespace-nowrap text-(--primary-color,#17375F)">
          <Icon size={16} className="text-(--primary-color,#17375F)" />
          <span className="text-xs font-bold">
            {value}
            {suffix}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function RecommendedCarousel({ properties }: { properties: RecommendedProperty[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (!properties || properties.length === 0) return null

  return (
    <TooltipProvider>
      <div className="space-y-6 py-8">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold text-(--primary-color,#17375F)">
            Imóveis Semelhantes em {properties[0].city}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="h-8 w-8 rounded-full border-zinc-200 text-(--primary-color,#17375F) hover:bg-(--primary-color,#17375F) hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="h-8 w-8 rounded-full border-zinc-200 text-(--primary-color,#17375F) hover:bg-(--primary-color,#17375F) hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {properties.map((property) => {
            // Lista completa de features (igual à listagem principal)
            const featuresList = [
              { icon: BedDouble, value: property.bedrooms, label: 'Quartos' },
              { icon: Bath, value: property.suites, label: 'Suítes' },
              { icon: Toilet, value: property.bathrooms, label: 'Banheiros' },
              { icon: CarFront, value: property.parkingSpots, label: 'Vagas' },
              { icon: LayoutGrid, value: property.totalArea, label: 'Área Total', suffix: ' m²' },
              { icon: Grid2X2, value: property.privateArea, label: 'Área Priv.', suffix: ' m²' },
            ].filter((item) => item.value && item.value !== '0' && item.value !== 0)

            return (
              <div key={property.id} className="max-w-[320px] min-w-[320px] snap-start">
                <Card className="group flex h-full flex-col overflow-hidden border-zinc-200 bg-white py-0 shadow-none transition-all duration-300 hover:shadow-lg">
                  <Link
                    href={`/imoveis/${property.slug}`}
                    className="flex h-full flex-col transition-colors hover:text-(--primary-color,#17375F)"
                  >
                    {/* Imagem */}
                    <div className="relative flex h-[250px] w-full items-center justify-center overflow-hidden bg-gray-100">
                      {property.coverImage ? (
                        <>
                          <Image
                            src={property.coverImage}
                            alt={property.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 320px"
                          />
                        </>
                      ) : (
                        <div className="text-sm text-gray-400">Sem imagem</div>
                      )}
                      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    <CardHeader className="py-4">
                      <h3
                        className="line-clamp-1 text-base font-bold text-zinc-800"
                        title={property.name}
                      >
                        {property.name}
                      </h3>
                      <p className="line-clamp-1 text-xs text-zinc-500">
                        {property.city} - {property.neighborhood}
                      </p>
                      {/* Summary com altura fixa para alinhar cards */}
                      <p className="mt-2 line-clamp-2 h-10 text-sm text-zinc-600">
                        {property.summary || ''}
                      </p>
                    </CardHeader>

                    {/* Carrossel de Features */}
                    {featuresList.length > 0 ? (
                      <CardContent className="m-0 w-full overflow-hidden py-4">
                        <p className="mb-2 text-xs font-semibold text-zinc-900">Informações</p>
                        <div className="flex flex-wrap gap-2">
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
                      <CardFooter className="flex items-center justify-between border-t bg-gray-50/50 py-4">
                        <span className="text-xl font-bold text-(--primary-color,#17375F)">
                          {property.priceOnRequest
                            ? 'Sob consulta'
                            : property.pricePrefix
                              ? `A partir de ${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`
                              : `${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`}
                        </span>
                        <div className="flex gap-2">
                          <Badge
                            className={
                              property.transactionType === 'ALUGUEL'
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : 'bg-(--primary-color,#17375F) hover:bg-(--primary-color,#17375F)'
                            }
                          >
                            {property.transactionType === 'ALUGUEL' ? 'Aluguel' : 'Venda'}
                          </Badge>
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
