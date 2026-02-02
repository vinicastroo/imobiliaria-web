"use client"

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, BedDouble, Bath, CarFront, Ruler, LayoutGrid } from 'lucide-react'

// UI Components
import { Card, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Importe sua logo aqui se necessário, ou use um placeholder
// import logo from '@/public/logo-auros-minimalist.svg'

// --- Interface dos dados que o PropertyPage vai passar ---
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

// --- Helper Component (Igual ao da sua lista) ---
interface FeatureProps {
  icon: React.ComponentType<{ size: number }>
  value?: string | number
  label: string
  suffix?: string
}

const Feature = ({ icon: Icon, value, label, suffix = "" }: FeatureProps) => {
  if (!value || value === '0' || value === 0) return null
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Icon size={16} />
            <span className="text-sm font-medium">{value}{suffix}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent><p>{label}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function RecommendedCarousel({ properties }: { properties: RecommendedProperty[] }) {
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

  console.log('Recommended Properties:', properties)
  return (
    <div className="space-y-6 py-8">
      {/* Cabeçalho do Carrossel */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold text-[#17375F]">Imóveis Semelhantes em {properties[0].city}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll('left')} className="h-8 w-8 rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll('right')} className="h-8 w-8 rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Área de Scroll Horizontal */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {properties.map(property => (
          <Link
            href={`/imoveis/${property.slug}`}
            key={property.id}
            className="min-w-[320px] max-w-[320px] snap-start group"
          >
            {/* INÍCIO DO CARD (Estrutura idêntica ao PropertyList) */}
            <Card className="h-full overflow-hidden hover:shadow-md transition-all shadow-none duration-300 border-gray-200 flex flex-col bg-white">

              {/* Imagem */}
              <div className="relative h-[250px] w-full bg-[#17375F] flex items-center justify-center overflow-hidden rounded-t-xl">
                {property.coverImage ? (
                  <Image
                    src={property.coverImage}
                    alt={property.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  // Fallback se não tiver imagem (adicione sua logo aqui se quiser)
                  <div className="text-white/50 text-sm">Sem imagem</div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 flex flex-col p-4">
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 line-clamp-1 text-lg" title={property.name}>
                    {property.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {property.city} - {property.neighborhood}
                  </p>
                  {/* Summary (opcional, se vier da API) */}
                  {property.summary && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {property.summary}
                    </p>
                  )}
                </div>

                {
                  (property.bedrooms || property.suites || property.bathrooms || property.parkingSpots || property.totalArea || property.privateArea) ? (
                    <div className="mt-auto">
                      <p className="text-xs font-bold text-[#17375F] uppercase mb-2">Informações</p>
                      <div className="flex flex-wrap gap-3">
                        <Feature icon={BedDouble} value={property.bedrooms} label="Quartos" />
                        <Feature icon={Bath} value={property.suites} label="Suítes" />
                        <Feature icon={Bath} value={property.bathrooms} label="Banheiros" />
                        <Feature icon={CarFront} value={property.parkingSpots} label="Vagas" />
                        <Feature icon={LayoutGrid} value={property.totalArea} label="Área Total" suffix=" m²" />
                        <Feature icon={Ruler} value={property.privateArea} label="Área Privativa" suffix=" m²" />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto" />
                  )
                }

                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="outline" className="font-normal text-xs">Venda</Badge>
                  {property.type_property && (
                    <Badge variant="outline" className="font-normal text-xs">{property.type_property.description}</Badge>
                  )}
                </div>
              </div>

              <CardFooter className="border-t p-4 flex justify-end bg-gray-50/50">
                <span className="text-xl font-bold text-[#17375F]">{property.value}</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}