'use client'

import { memo } from 'react'
import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { BedDouble, Bath, CarFront, Ruler, LayoutGrid, Toilet } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { parsePropertySearch, propertyQueryKey } from '@/lib/property-search'
import { getProperties } from '@/app/api/get-properties'
import { PropertyGallery } from './property-gallery'

// Helper component - memoized to prevent unnecessary re-renders
interface FeatureProps {
  icon: React.ComponentType<{ size: number }>
  value: string | number
  label: string
  suffix?: string
}

const Feature = memo(function Feature({ icon: Icon, value, label, suffix = '' }: FeatureProps) {
  if (!Number(value)) return null
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Icon size={16} />
            <span className="text-sm font-medium">
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
})

export function PropertyList() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { page, filters } = parsePropertySearch(
    Object.fromEntries([...searchParams.keys()].map((key) => [key, searchParams.get(key)])),
  )

  const {
    data: result,
    isLoading,
    isError,
    error,
    status,
    fetchStatus,
  } = useQuery({
    queryKey: propertyQueryKey(page, filters),
    staleTime: 60_000,
    queryFn: () => getProperties({ page, ...filters }),
  })

  console.log('[PropertyList] query state:', {
    status,
    fetchStatus,
    isLoading,
    isError,
    error,
    page,
    filters,
  })
  console.log('[PropertyList] result:', {
    properties: result?.properties?.length,
    totalCount: result?.totalCount,
    totalPages: result?.totalPages,
  })

  // CORREÇÃO 1: Usar totalPages direto da API (sem dividir novamente)
  const totalPages = result?.totalPages || 1

  // CORREÇÃO 2: Ler o totalCount para o texto do header
  const totalCount = result?.totalCount || 0

  const pageHref = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newPage === 1) params.delete('page')
    else params.set('page', String(newPage))
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  const getPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) items.push(i)
    } else {
      if (page <= 3) {
        items.push(1, 2, 3, '...', totalPages)
      } else if (page >= totalPages - 2) {
        items.push(1, '...', totalPages - 2, totalPages - 1, totalPages)
      } else {
        items.push(1, '...', page - 1, page, page + 1, '...', totalPages)
      }
    }
    return items
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header com contagem */}
      <div className="flex items-center justify-between">
        {!isLoading && !isError && (
          <h2 className="text-lg font-bold text-gray-700">
            {/* CORREÇÃO 3: Exibir totalCount (ex: 130 Imóveis) e não totalPages */}
            {`${totalCount} ${totalCount === 1 ? 'Imóvel encontrado' : 'Imóveis encontrados'}`}
          </h2>
        )}
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <Card role="alert" className="p-8 text-center text-gray-500">
          Não foi possível carregar os imóveis. Tente novamente em instantes.
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && result?.properties.length === 0 && (
        <Card className="p-8 text-center text-gray-500">
          Nenhum imóvel encontrado com os filtros selecionados.
        </Card>
      )}

      {/* Lista de Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {result?.properties.map((property) => (
          <Card
            key={property.id}
            className="flex h-full flex-col overflow-hidden border-gray-200 shadow-none transition-all duration-300 hover:shadow-md"
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

            {/* Conteúdo */}
            <Link href={`/imoveis/${property.slug}`} className="group flex flex-1 flex-col">
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-4">
                  <h3 className="line-clamp-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-(--primary-color,#17375F)">
                    {property.name}
                  </h3>
                  {property.code && <p className="text-xs text-gray-400">Ref: #{property.code}</p>}
                  <p className="text-sm text-gray-500">
                    {property.city} - {property.neighborhood}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs text-gray-400">{property.summary}</p>
                </div>

                <div className="mt-auto">
                  <p className="mb-2 text-xs font-bold text-(--primary-color,#17375F) uppercase">
                    Informações
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Feature icon={BedDouble} value={property.bedrooms} label="Quartos" />
                    <Feature icon={Bath} value={property.suites} label="Suítes" />
                    <Feature icon={Toilet} value={property.bathrooms} label="Banheiros" />
                    <Feature icon={CarFront} value={property.parkingSpots} label="Vagas" />
                    <Feature
                      icon={LayoutGrid}
                      value={property.totalArea}
                      label="Área Total"
                      suffix=" m²"
                    />
                    <Feature
                      icon={Ruler}
                      value={property.privateArea}
                      label="Área Privativa"
                      suffix=" m²"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs font-normal ${property.transactionType === 'ALUGUEL' ? 'border-emerald-600 text-emerald-600' : ''}`}
                  >
                    {property.transactionType === 'ALUGUEL' ? 'Aluguel' : 'Venda'}
                  </Badge>
                  {property.type_property && (
                    <Badge variant="outline" className="text-xs font-normal">
                      {property.type_property.description}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-end border-t bg-gray-50/50 p-4">
                <span className="text-xl font-bold text-(--primary-color,#17375F)">
                  {property.priceOnRequest
                    ? 'Sob consulta'
                    : property.pricePrefix
                      ? `A partir de ${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`
                      : `${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`}
                </span>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <Pagination className="my-8 select-none">
          <PaginationContent>
            {/* Botão Anterior */}
            <PaginationItem>
              <PaginationPrevious
                href={page > 1 ? pageHref(page - 1) : undefined}
                aria-disabled={page <= 1}
                tabIndex={page <= 1 ? -1 : 0}
                className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              >
                Anterior
              </PaginationPrevious>
            </PaginationItem>

            {/* Números das Páginas */}
            {getPaginationItems().map((item, index) => {
              if (item === '...') {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              return (
                <PaginationItem key={item}>
                  <PaginationLink
                    isActive={page === item}
                    href={pageHref(item as number)}
                    className="cursor-pointer"
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            {/* Botão Próxima */}
            <PaginationItem>
              <PaginationNext
                href={page < totalPages ? pageHref(page + 1) : undefined}
                aria-disabled={page >= totalPages}
                tabIndex={page >= totalPages ? -1 : 0}
                className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              >
                Próxima
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
