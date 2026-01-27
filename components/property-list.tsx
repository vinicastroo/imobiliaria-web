"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { BedDouble, Bath, CarFront, Ruler, LayoutGrid } from 'lucide-react'

import { Card, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

import { getProperties } from '@/app/api/get-properties'
import logo from '@/public/logo-auros-minimalist.svg'

// Helper component
interface FeatureProps {
  icon: React.ComponentType<{ size: number }>
  value: string | number
  label: string
  suffix?: string
}

const Feature = ({ icon: Icon, value, label, suffix = "" }: FeatureProps) => {
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
}

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

  const totalPages = result ? Math.ceil(result.totalPages / 12) || 1 : 1

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header com contagem */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-700">
          {result ? `${result.totalPages} ${result.totalPages === 1 ? 'Imóvel encontrado' : 'Imóveis encontrados'}` : 'Carregando...'}
        </h2>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <Link key={property.slug} href={`/imoveis/${property.slug}`} target="_blank" className="group">
            <Card className="h-full overflow-hidden hover:shadow-md transition-all shadow-none duration-300 border-gray-200 flex flex-col">
              {/* Imagem */}
              <div className="relative h-[250px] w-full bg-[#17375F] flex items-center justify-center overflow-hidden">
                {property.files.length > 0 ? (
                  <Image
                    src={property.files[0].path}
                    alt={property.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Image src={logo} alt="Logo" width={100} height={100} className="opacity-50" />
                )}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 flex flex-col p-4">
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 line-clamp-1 text-lg">{property.name}</h3>
                  <p className="text-sm text-gray-500">{property.city} - {property.neighborhood}</p>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">{property.summary}</p>
                </div>

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

                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="outline" className="font-normal text-xs">Venda</Badge>
                  <Badge variant="outline" className="font-normal text-xs">{property.type_property.description}</Badge>
                </div>
              </div>

              {/* Footer / Preço */}
              <CardFooter className="border-t p-4 flex justify-end bg-gray-50/50">
                <span className="text-xl font-bold text-[#17375F]">{property.value}</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}

            {/* Lógica simples de paginação (pode ser expandida) */}
            <PaginationItem>
              <PaginationLink isActive>{page}</PaginationLink>
            </PaginationItem>

            {page < totalPages && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}