"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { BedDouble, Bath, CarFront, Ruler, Grid2X2 } from 'lucide-react' // Ícones equivalentes

import { Button } from 'components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from 'components/ui/card'
import { Skeleton } from 'components/ui/skeleton'
import { Badge } from 'components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'components/ui/tooltip'

import { getRecentProperties } from '@/app/api/get-recent-properties'
import square from '@/public/square.svg'


interface PropertyFeatureProps {
  icon: React.ComponentType<{ size: number }>;
  value: string | number;
  label: string;
  suffix?: string;
}

// Helper component para os ícones com tooltip
const PropertyFeature = ({ icon: Icon, value, label, suffix = "" }: PropertyFeatureProps) => {
  if (!Number(value)) return null
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 text-gray-600">
            <Icon size={20} />
            <span className="font-bold text-sm">{value}{suffix}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent><p>{label}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function RecentProperties() {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-properties'],
    queryFn: getRecentProperties,
  })

  return (
    <section className="relative w-full py-16 px-4 bg-zinc-50 flex flex-col items-center">
      {/* Background Decorativo (Simulado com CSS classes ou imagens absolutas) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: `url(${square.src})`, backgroundRepeat: 'space' }} />

      <div className="text-center mb-10 z-10">
        <h2 className="text-2xl font-normal text-black">Propriedades</h2>
        <h2 className="text-2xl font-bold text-[#17375F]">Recentes</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1200px] z-10">
        {isLoading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}

        {data?.properties.map((property) => (
          <Link key={property.slug} href={`/imoveis/${property.slug}`} target="_blank" className="group">
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow shadow-none duration-300 border-zinc-200 py-0">
              <div className="relative h-[250px] bg-[#17375F] flex items-center justify-center overflow-hidden">
                {property.files.length > 0 ? (
                  <Image
                    src={property.files[0].path}
                    alt={property.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Image src="./logo-auros-minimalist.svg" alt="Logo" width={120} height={120} className="opacity-50" />
                )}
              </div>

              <CardHeader className="pb-2">
                <h3 className="text-lg font-bold text-zinc-800 line-clamp-1">{property.name}</h3>
                <p className="text-sm text-zinc-500">{property.city} - {property.neighborhood}</p>
                <p className="text-sm text-zinc-600 line-clamp-2 mt-2 h-10">{property.summary}</p>
              </CardHeader>

              <CardContent>
                <p className="text-sm font-semibold text-zinc-900 mb-3">Informações</p>
                <div className="flex flex-wrap gap-4 mb-2">
                  <PropertyFeature icon={BedDouble} value={property.bedrooms} label="Quartos" />
                  <PropertyFeature icon={Bath} value={property.suites} label="Suítes" />
                  <PropertyFeature icon={Bath} value={property.bathrooms} label="Banheiros" />
                  <PropertyFeature icon={CarFront} value={property.parkingSpots} label="Vagas" />
                  <PropertyFeature icon={Ruler} value={property.totalArea} label="Área Total" suffix=" m²" />
                  <PropertyFeature icon={Grid2X2} value={property.privateArea} label="Área Privativa" suffix=" m²" />
                </div>


              </CardContent>

              <CardFooter className="flex items-center justify-between border-t py-4">
                <span className="text-xl font-bold text-[#17375F]">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(property.value))}</span>
                <Badge className="bg-[#17375F] hover:bg-[#122b4a]">Venda</Badge>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {data && data.properties.length > 0 && (
        <Link href="/imoveis" className="mt-10">
          <Button variant="outline" size="lg" className="border-[#17375F] text-[#17375F] hover:bg-zinc-50">
            Ver todos
          </Button>
        </Link>
      )}
    </section>
  )
}