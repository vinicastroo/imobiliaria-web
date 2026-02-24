"use client"

import { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { BedDouble, Bath, CarFront, Ruler, LayoutGrid, Toilet } from 'lucide-react'

import { Card, CardFooter } from '@/components/ui/card'
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

import { getProperties } from '@/app/api/get-properties'
import { PropertyGallery } from './property-gallery'

// Helper component - memoized to prevent unnecessary re-renders
interface FeatureProps {
  icon: React.ComponentType<{ size: number }>
  value: string | number
  label: string
  suffix?: string
}

const Feature = memo(function Feature({ icon: Icon, value, label, suffix = "" }: FeatureProps) {
  if (!Number(value)) return null
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
})

export function PropertyList() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page')) || 1

  // Extrai filtros da URL
  const filters = {
    type: searchParams.get('tipoImovel'),
    city: searchParams.get('cidade'),
    neighborhood: searchParams.get('bairro'),
    bedrooms: searchParams.get('quartos'),
    bathrooms: searchParams.get('banheiros'),
    suites: searchParams.get('suites'),
    parkingSpots: searchParams.get('garagem'),
    totalArea: searchParams.get('areaTotal'),
    privateArea: searchParams.get('areaTerreno'),
  }

  const { data: result, isLoading } = useQuery({
    queryKey: ['properties', page, ...Object.values(filters)],
    queryFn: () => getProperties({ page, ...filters }),
  })

  // CORREÇÃO 1: Usar totalPages direto da API (sem dividir novamente)
  const totalPages = result?.totalPages || 1

  // CORREÇÃO 2: Ler o totalCount para o texto do header
  const totalCount = result?.totalCount || 0

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return

    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())

    router.push(`${pathname}?${params.toString()}`)

    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    <div className="w-full flex flex-col gap-6">
      {/* Header com contagem */}
      <div className="flex justify-between items-center">
        {!isLoading && (
          <h2 className="text-lg font-bold text-gray-700">
            {/* CORREÇÃO 3: Exibir totalCount (ex: 130 Imóveis) e não totalPages */}
            {`${totalCount} ${totalCount === 1 ? 'Imóvel encontrado' : 'Imóveis encontrados'}`}
          </h2>
        )}
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Empty State */}
      {!isLoading && result?.properties.length === 0 && (
        <Card className="p-8 text-center text-gray-500">
          Nenhum imóvel encontrado com os filtros selecionados.
        </Card>
      )}

      {/* Lista de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result?.properties.map((property) => (
          <Card key={property.id} className="h-full overflow-hidden hover:shadow-md transition-all shadow-none duration-300 border-gray-200 flex flex-col">
            <PropertyGallery
              items={property.files.map(file => ({
                id: file.id,
                img: file.path,
                fileName: file.fileName
              }))}
              path={`/imoveis/${property.slug}`}
              propertyName={property.name}
              isRecentProperty
              applyWatermark={property.applyWatermark}
            />

            {/* Conteúdo */}
            <Link href={`/imoveis/${property.slug}`} className="group flex flex-col flex-1">
              <div className="flex-1 flex flex-col p-4">
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 line-clamp-1 text-lg group-hover:text-(--primary-color,#17375F) transition-colors">{property.name}</h3>
                  <p className="text-sm text-gray-500">{property.city} - {property.neighborhood}</p>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">{property.summary}</p>
                </div>

                <div className="mt-auto">
                  <p className="text-xs font-bold text-(--primary-color,#17375F) uppercase mb-2">Informações</p>
                  <div className="flex flex-wrap gap-3">
                    <Feature icon={BedDouble} value={property.bedrooms} label="Quartos" />
                    <Feature icon={Bath} value={property.suites} label="Suítes" />
                    <Feature icon={Toilet} value={property.bathrooms} label="Banheiros" />
                    <Feature icon={CarFront} value={property.parkingSpots} label="Vagas" />
                    <Feature icon={LayoutGrid} value={property.totalArea} label="Área Total" suffix=" m²" />
                    <Feature icon={Ruler} value={property.privateArea} label="Área Privativa" suffix=" m²" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="outline" className={`font-normal text-xs ${property.transactionType === 'ALUGUEL' ? 'text-emerald-600 border-emerald-600' : ''}`}>
                    {property.transactionType === 'ALUGUEL' ? 'Aluguel' : 'Venda'}
                  </Badge>
                  {property.type_property && (
                    <Badge variant="outline" className="font-normal text-xs">{property.type_property.description}</Badge>
                  )}
                </div>
              </div>

              <div className="border-t p-4 flex justify-end bg-gray-50/50">
                <span className="text-xl font-bold text-(--primary-color,#17375F)">
                  {property.priceOnRequest
                    ? 'Sob consulta'
                    : property.pricePrefix
                      ? `Até ${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`
                      : `${property.value}${property.transactionType === 'ALUGUEL' ? '/mês' : ''}`}
                </span>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      {
        totalPages > 1 && (
          <Pagination className="my-8 select-none">
            <PaginationContent>

              {/* Botão Anterior */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  aria-disabled={page <= 1}
                  tabIndex={page <= 1 ? -1 : 0}
                  className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                      onClick={() => handlePageChange(item as number)}
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
                  onClick={() => handlePageChange(page + 1)}
                  aria-disabled={page >= totalPages}
                  tabIndex={page >= totalPages ? -1 : 0}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                >
                  Próxima
                </PaginationNext>
              </PaginationItem>

            </PaginationContent>
          </Pagination>
        )
      }
    </div >
  )
}