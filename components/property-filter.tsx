"use client"

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Bed, Bath, CarFront, Ruler } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import { getCities } from '@/app/api/get-cities'
import { getTypes } from '@/app/api/get-types'
import { getNeighborhoods } from '@/app/api/get-neighborhoods'

const createSchema = z.object({
  type: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  suites: z.string().optional(),
  parkingSpots: z.string().optional(),
  totalArea: z.string().optional(),
  privateArea: z.string().optional(),
})

type SchemaQuestion = z.infer<typeof createSchema>

export function PropertyFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { control, handleSubmit, watch, reset, formState: { isLoading } } = useForm<SchemaQuestion>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      type: searchParams.get('tipoImovel') ?? '',
      city: searchParams.get('cidade') ?? '',
      neighborhood: searchParams.get('bairro') ?? '',
      bedrooms: searchParams.get('quartos') ?? '',
      bathrooms: searchParams.get('banheiros') ?? '',
      suites: searchParams.get('suites') ?? '',
      parkingSpots: searchParams.get('garagem') ?? '',
      totalArea: searchParams.get('areaTotal') ?? '',
      privateArea: searchParams.get('areaTerreno') ?? '',
    },
  })

  const city = watch('city')

  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
    staleTime: 60 * 60 * 1000,
  })
  const { data: types } = useQuery({
    queryKey: ['types'],
    queryFn: getTypes,
    staleTime: 60 * 60 * 1000,
  })
  const { data: neighborhoods } = useQuery({
    queryKey: ['neighborhoods', city],
    queryFn: () => getNeighborhoods({ city }),
    enabled: !!city,
    staleTime: 30 * 60 * 1000,
  })

  const onSubmit = (data: SchemaQuestion) => {
    const params = new URLSearchParams(searchParams.toString())

    // Helper para setar ou deletar params
    const updateParam = (key: string, value?: string) => {
      if (value && value !== 'undefined' && value !== '') params.set(key, value)
      else params.delete(key)
    }

    updateParam('tipoImovel', data.type)
    updateParam('cidade', data.city)
    updateParam('bairro', data.neighborhood)
    updateParam('quartos', data.bedrooms)
    updateParam('banheiros', data.bathrooms)
    updateParam('suites', data.suites)
    updateParam('garagem', data.parkingSpots)
    updateParam('areaTotal', data.totalArea)
    updateParam('areaTerreno', data.privateArea)

    params.set('page', '1') // Resetar para página 1 ao filtrar
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClearFilter = () => {
    reset({
      city: '', type: '', neighborhood: '', bathrooms: '',
      bedrooms: '', parkingSpots: '', privateArea: '', suites: '', totalArea: '',
    })
    router.replace(pathname)
  }

  return (
    <Card className="w-full border-none shadow-none">
      <CardContent className="p-4 space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          <div className="space-y-2">
            <Label>Tipo Imóvel</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-full'><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undefined">Todos</SelectItem>
                    {types?.map((t) => (
                      <SelectItem key={t.id} value={t.description}>{t.description}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Cidade</Label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-full'><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undefined">Todas</SelectItem>
                    {cities?.map((c) => (
                      <SelectItem key={c.city} value={c.city}>{c.city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Bairro</Label>
            <Controller
              name="neighborhood"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={!neighborhoods}>
                  <SelectTrigger className='w-full'><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undefined">Todos</SelectItem>
                    {neighborhoods?.map((n) => (
                      <SelectItem key={n.neighborhood} value={n.neighborhood}>{n.neighborhood}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Separator className="my-2" />

          <Label className="text-gray-500">Características</Label>

          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <Bed className="text-gray-400 w-5 h-5" />
              <Input placeholder="Nº Quartos" {...control.register('bedrooms')} className="h-9" />
            </div>
            <div className="flex items-center gap-2">
              <Bath className="text-gray-400 w-5 h-5" />
              <Input placeholder="Nº Suítes" {...control.register('suites')} className="h-9" />
            </div>
            <div className="flex items-center gap-2">
              <Bath className="text-gray-400 w-5 h-5" />
              <Input placeholder="Nº Banheiros" {...control.register('bathrooms')} className="h-9" />
            </div>
            <div className="flex items-center gap-2">
              <CarFront className="text-gray-400 w-5 h-5" />
              <Input placeholder="Vagas" {...control.register('parkingSpots')} className="h-9" />
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="text-gray-400 w-5 h-5" />
              <Input placeholder="Área Total (m²)" {...control.register('totalArea')} className="h-9" />
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="text-gray-400 w-5 h-5" />
              <Input placeholder="Área Priv. (m²)" {...control.register('privateArea')} className="h-9" />
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button type="submit" className="w-full bg-[#17375F]" disabled={isLoading}>
              Filtrar
            </Button>
            <Button type="button" variant="outline" onClick={handleClearFilter} className="w-full">
              Limpar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}