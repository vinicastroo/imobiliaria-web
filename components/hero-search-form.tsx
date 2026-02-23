"use client"

import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { getCities } from '@/app/api/get-cities'
import { getTypes } from '@/app/api/get-types'
import { getNeighborhoods } from '@/app/api/get-neighborhoods'

const searchSchema = z.object({
  type_id: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
})

type SearchFormData = z.infer<typeof searchSchema>

interface HeroSearchFormProps {
  primaryColor?: string
}

export function HeroSearchForm({ primaryColor }: HeroSearchFormProps) {
  const router = useRouter()

  const { control, watch, handleSubmit, formState: { isLoading } } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  })

  const city = watch('city')

  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
    staleTime: 60 * 60 * 1000, // 1 hora - cidades mudam raramente
  })
  const { data: types } = useQuery({
    queryKey: ['types'],
    queryFn: getTypes,
    staleTime: 60 * 60 * 1000, // 1 hora
  })
  const { data: neighborhoods } = useQuery({
    queryKey: ['neighborhoods', city],
    queryFn: () => getNeighborhoods({ city }),
    enabled: !!city,
    staleTime: 30 * 60 * 1000, // 30 minutos
  })

  const onSubmit = (data: SearchFormData) => {
    const params = new URLSearchParams()
    if (data.type_id) params.set('tipoImovel', data.type_id)
    if (data.city) params.set('cidade', data.city)
    if (data.neighborhood) params.set('bairro', data.neighborhood)

    router.push(`/imoveis?${params.toString()}`)
  }

  return (
    <Card className="w-full bg-white/95 md:bg-white/10 md:backdrop-blur-md border-none shadow-2xl">
      <CardContent className="py-6 px-4 md:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-center">

          <div className="w-full text-left">
            <Controller
              name="type_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} >
                  <SelectTrigger className="bg-white text-black w-full h-12 md:h-14 border-0 md:border">
                    <SelectValue placeholder="Tipo de Imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    {types?.map((type: { id: string; description: string }) => (
                      <SelectItem key={type.id} value={type.description}>{type.description}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="w-full text-left">
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-white text-black w-full h-12 md:h-14 border-0 md:border">
                    <SelectValue placeholder="Cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities?.map((c: { city: string }) => (
                      <SelectItem key={c.city} value={c.city}>{c.city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="w-full text-left">
            <Controller
              name="neighborhood"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={!neighborhoods} >
                  <SelectTrigger className="bg-white text-black w-full h-12 md:h-14 border-0 md:border">
                    <SelectValue placeholder="Bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    {neighborhoods?.map((n: { neighborhood: string }) => (
                      <SelectItem key={n.neighborhood} value={n.neighborhood}>{n.neighborhood}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex items-end w-full md:w-auto">
            <Button size="lg" className="cursor-pointer w-full md:w-auto text-lg gap-2 px-14 py-3 hover:opacity-90 transition-opacity" style={{ backgroundColor: primaryColor ?? '#17375F' }} disabled={isLoading}>
              <Search size={20} />
              <span className="text-base md:hidden">Buscar Imóveis</span>
              <span className="hidden text-base md:inline">Buscar</span>
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  )
}
