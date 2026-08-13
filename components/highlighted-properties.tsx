'use client'

import { memo } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { BedDouble, Bath, CarFront, Ruler, Grid2X2, Toilet, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { getHighlightedProperties } from '@/app/api/get-highlighted-properties'
import type { Properties } from '@/app/api/get-properties'
import { PropertyGallery } from './property-gallery'
import square from '@/public/square.svg'

import React from 'react'

interface PropertyFeatureProps {
  icon: React.ComponentType<{ size: number; className?: string }>
  value: string | number
  label: string
  suffix?: string
}

const PropertyFeature = memo(function PropertyFeature({
  icon: Icon,
  value,
  label,
  suffix = '',
}: PropertyFeatureProps) {
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
})

export interface HighlightedPropertiesGridProps {
  agencyId?: string
  renderCTA?: (hasData: boolean) => React.ReactNode
  initialProperties?: Properties[]
}

export function HighlightedPropertiesGrid({
  agencyId,
  renderCTA,
  initialProperties,
}: HighlightedPropertiesGridProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['highlighted-properties', agencyId],
    queryFn: () => getHighlightedProperties(agencyId),
    enabled: !initialProperties,
    initialData: initialProperties ? { properties: initialProperties } : undefined,
  })

  if (!initialProperties && !isLoading && (!data?.properties || data.properties.length === 0))
    return null
  if (initialProperties && initialProperties.length === 0) return null

  return (
    <TooltipProvider>
      <div className="z-10 grid w-full max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex h-full flex-col gap-2 overflow-hidden rounded-xl border bg-white p-0"
            >
              <Skeleton className="h-[250px] w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            </div>
          ))}

        {data?.properties.map((property) => {
          const featuresList = [
            { icon: BedDouble, value: property.bedrooms, label: 'Quartos' },
            { icon: Bath, value: property.suites, label: 'Suítes' },
            { icon: Toilet, value: property.bathrooms, label: 'Banheiros' },
            { icon: CarFront, value: property.parkingSpots, label: 'Vagas' },
            { icon: Ruler, value: property.totalArea, label: 'Área Total', suffix: ' m²' },
            { icon: Grid2X2, value: property.privateArea, label: 'Área Priv.', suffix: ' m²' },
          ].filter((item) => item.value && item.value !== '0')

          return (
            <Card
              key={property.slug}
              className="group flex h-full flex-col overflow-hidden border-zinc-200 bg-white py-0 shadow-none transition-all duration-300 group-hover:shadow-lg"
            >
              <PropertyGallery
                items={property.files.map((file) => ({
                  id: file.id,
                  img: file.path,
                  fileName: file.fileName,
                }))}
                path={`/imoveis/${property.slug}`}
                propertyName={property.name}
                isRecentProperty
              />

              <Link
                href={`/imoveis/${property.slug}`}
                className="flex flex-1 flex-col transition-colors group-hover:text-(--primary-color,#17375F)"
              >
                <CardHeader className="pb-2">
                  <h3
                    className="line-clamp-1 text-lg font-bold text-zinc-800"
                    title={property.name}
                  >
                    {property.name}
                  </h3>
                  {property.code && <p className="text-xs text-zinc-400">Ref: #{property.code}</p>}
                  <p className="text-sm text-zinc-500">
                    {property.city} - {property.neighborhood}
                  </p>
                  <p className="mt-2 line-clamp-2 h-10 text-sm text-zinc-600">{property.summary}</p>
                </CardHeader>

                {featuresList.length > 0 && (
                  <CardContent className="relative z-50 w-full py-4">
                    <p className="mb-2 text-sm font-semibold text-zinc-900">Informações</p>
                    <div className="flex w-full flex-wrap gap-2">
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
                  <CardFooter className="flex items-center justify-between border-t bg-gray-50/50 py-4">
                    <span className="text-xl font-bold text-(--primary-color,#17375F)">
                      {property.priceOnRequest
                        ? 'Sob consulta'
                        : property.pricePrefix
                          ? `A partir de ${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`
                          : `${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`}
                    </span>
                    <Badge
                      className={
                        property.transactionType === 'ALUGUEL'
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-(--primary-color,#17375F) hover:bg-(--primary-color,#17375F)'
                      }
                    >
                      {property.transactionType === 'ALUGUEL' ? 'Aluguel' : 'Venda'}
                    </Badge>
                  </CardFooter>
                </div>
              </Link>
            </Card>
          )
        })}
      </div>

      {renderCTA?.(Boolean(data?.properties?.length))}
    </TooltipProvider>
  )
}

// Wrapper padrão — mantém compatibilidade com usos existentes
export function HighlightedProperties({ agencyId }: { agencyId?: string }) {
  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden bg-zinc-50 px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 -top-20 -left-20 opacity-40"
        style={{ backgroundImage: `url(${square.src})`, backgroundRepeat: 'no-repeat' }}
      />

      <div className="z-10 mb-10 text-center">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-2xl font-normal text-black">Imóveis em</h2>
        </div>
        <h2 className="text-2xl font-bold text-(--primary-color,#17375F)">Destaque</h2>
      </div>

      <HighlightedPropertiesGrid agencyId={agencyId} />
    </section>
  )
}
