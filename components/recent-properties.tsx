"use client"

import { memo } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { BedDouble, Bath, CarFront, Ruler, Grid2X2, Toilet } from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { getRecentProperties } from '@/app/api/get-recent-properties'
import square from '@/public/square.svg'

import React from 'react'
import { PropertyGallery } from './property-gallery'

interface PropertyFeatureProps {
  icon: React.ComponentType<{ size: number, className?: string }>;
  value: string | number;
  label: string;
  suffix?: string;
}

const PropertyFeature = memo(function PropertyFeature({ icon: Icon, value, label, suffix = "" }: PropertyFeatureProps) {
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
})

export function RecentProperties() {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-properties'],
    queryFn: getRecentProperties,
  })

  return (
    <TooltipProvider>
      <section className="relative w-full py-16 px-4 bg-zinc-50 flex flex-col items-center overflow-hidden">

        {/* Background Decorativo */}
        <div className="absolute inset-0 -top-20 -left-20 opacity-40 pointer-events-none"
          style={{ backgroundImage: `url(${square.src})`, backgroundRepeat: 'no-repeat' }} />

        <div className="text-center mb-10 z-10">
          <h2 className="text-2xl font-normal text-black">Propriedades</h2>
          <h2 className="text-2xl font-bold text-[#17375F]">Recentes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1200px] z-10">

          {/* Skeleton Loading */}
          {isLoading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 h-full border rounded-xl p-0 overflow-hidden bg-white">
              <Skeleton className="h-[250px] w-full rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            </div>
          ))}

          {/* Cards de Imóveis */}
          {data?.properties.map((property) => {

            // Filtra as features
            const featuresList = [
              { icon: BedDouble, value: property.bedrooms, label: "Quartos" },
              { icon: Bath, value: property.suites, label: "Suítes" },
              { icon: Toilet, value: property.bathrooms, label: "Banheiros" },
              { icon: CarFront, value: property.parkingSpots, label: "Vagas" },
              { icon: Ruler, value: property.totalArea, label: "Área Total", suffix: " m²" },
              { icon: Grid2X2, value: property.privateArea, label: "Área Priv.", suffix: " m²" },
            ].filter(item => item.value && item.value !== '0');

            return (
              <Card key={property.slug} className="h-full overflow-hidden group group-hover:shadow-lg transition-all shadow-none duration-300 border-zinc-200 py-0 flex flex-col bg-white group">

                <PropertyGallery
                  items={property.files.map(file => ({
                    id: file.id,
                    img: file.path,
                    fileName: file.fileName
                  }))}
                  path={`/imoveis/${property.slug}`}
                  propertyName={property.name}
                  isRecentProperty
                />

                <Link href={`/imoveis/${property.slug}`} className="group-hover:text-[#17375F] transition-colors flex-1 flex flex-col">
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-bold text-zinc-800 line-clamp-1" title={property.name}>
                      {property.name}
                    </h3>
                    <p className="text-sm text-zinc-500">{property.city} - {property.neighborhood}</p>
                    <p className="text-sm text-zinc-600 line-clamp-2 mt-2 h-10">{property.summary}</p>
                  </CardHeader>

                  {featuresList.length > 0 && (
                    <CardContent className="w-full py-4 relative z-50">
                      <p className="text-sm font-semibold text-zinc-900 mb-2">Informações</p>
                      <div className="flex gap-2 w-full flex-wrap">
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
                  )}

                  <div className="mt-auto">
                    <CardFooter className="flex items-center justify-between border-t py-4 bg-gray-50/50">
                      <span className="text-xl font-bold text-[#17375F]">{property.value}</span>
                      <Badge className="bg-[#17375F] hover:bg-[#122b4a]">Venda</Badge>
                    </CardFooter>
                  </div>
                </Link>
              </Card>
            )
          })}
        </div>

        {data && data.properties.length > 0 && (
          <Link href="/imoveis" className="mt-10">
            <Button variant="outline" size="lg" className="bg-[#17375F] text-white hover:bg-[#17375F]/80 hover:text-white cursor-pointer ">
              Ver todos os imóveis
            </Button>
          </Link>
        )}
      </section>
    </TooltipProvider>
  )
}