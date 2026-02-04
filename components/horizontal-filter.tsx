"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal, X, ChevronDown, BedDouble, Bath, CarFront, Toilet } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'

// UI Components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

// APIs
import { getCities } from '@/app/api/get-cities'
import { getTypes } from '@/app/api/get-types'
import { getNeighborhoods } from '@/app/api/get-neighborhoods'

// --- SUB-COMPONENTE: Seletor de Botões (Pílulas) Refatorado ---
// Agora aceita value/onChange para funcionar tanto na URL direta quanto no React Hook Form
interface NumberSelectorProps {
  label: string
  value: string
  onChange: (value: string) => void
  max?: number
  icon?: React.ComponentType<{ size: number; className?: string }>
}

const NumberSelector = ({ label, value, onChange, max = 4, icon: Icon }: NumberSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {Icon && <Icon size={16} className="text-gray-400" />}
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button" // Importante para não submeter formulário
          onClick={() => onChange('')}
          className={`
              px-3 py-1.5 rounded-full text-xs font-medium transition-all border
              ${!value
              ? 'bg-[#17375F] text-white border-[#17375F]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-[#17375F] hover:text-[#17375F]'}
            `}
        >
          Tanto faz
        </button>
        {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
          <button
            type="button"
            key={num}
            onClick={() => onChange(String(num))}
            className={`
                w-8 h-8 rounded-full text-xs font-medium transition-all border flex items-center justify-center
                ${value === String(num)
                ? 'bg-[#17375F] text-white border-[#17375F]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#17375F] hover:text-[#17375F]'}
              `}
          >
            {num}+
          </button>
        ))}
      </div>
    </div>
  )
}

export function HorizontalFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // --- LEITURA DA URL (Estado Verdadeiro) ---
  const currentCity = searchParams.get('cidade') || ''
  const currentType = searchParams.get('tipoImovel') || ''
  const currentNeighborhood = searchParams.get('bairro') || ''
  const currentBedroom = searchParams.get('quartos') || ''
  const currentBathroom = searchParams.get('banheiros') || ''
  const currentSuite = searchParams.get('suites') || ''
  const currentParking = searchParams.get('garagem') || ''

  // --- QUERIES GERAIS ---
  const { data: cities } = useQuery({ queryKey: ['cities'], queryFn: getCities })
  const { data: types } = useQuery({ queryKey: ['types'], queryFn: getTypes })
  // Query de bairros para o filtro horizontal (baseado na URL)
  const { data: neighborhoods } = useQuery({
    queryKey: ['neighborhoods', currentCity],
    queryFn: () => getNeighborhoods({ city: currentCity }),
    enabled: !!currentCity
  })

  // --- FUNÇÃO DE ATUALIZAÇÃO DIRETA (Barra Horizontal) ---
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all' && value !== '') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // --- FORMULÁRIO COMPLETO (Modal/Dialog) ---
  interface FilterFormData {
    city: string
    neighborhood: string
    type: string
    bedrooms: string
    suites: string
    bathrooms: string
    parkingSpots: string
    minPrice: string
    maxPrice: string
  }

  const { register, control, handleSubmit, reset, watch, setValue } = useForm<FilterFormData>({
    defaultValues: {
      city: currentCity,
      neighborhood: currentNeighborhood,
      type: currentType,
      bedrooms: currentBedroom,
      suites: currentSuite,
      bathrooms: currentBathroom,
      parkingSpots: currentParking,
      minPrice: searchParams.get('precoMin') || '',
      maxPrice: searchParams.get('precoMax') || '',
    }
  })

  // Sincroniza o form quando a URL muda (ex: usuário usou a barra horizontal)
  useEffect(() => {
    reset({
      city: currentCity,
      neighborhood: currentNeighborhood,
      type: currentType,
      bedrooms: currentBedroom,
      suites: currentSuite,
      bathrooms: currentBathroom,
      parkingSpots: currentParking,
      minPrice: searchParams.get('precoMin') || '',
      maxPrice: searchParams.get('precoMax') || '',
    })
  }, [searchParams, reset, currentCity, currentNeighborhood, currentType, currentBedroom, currentSuite, currentBathroom, currentParking])

  // Lógica de Bairro DENTRO do Modal (Observa o select do form, não a URL)
  const formCity = watch('city')
  const { data: formNeighborhoods } = useQuery({
    queryKey: ['neighborhoods', formCity],
    queryFn: () => getNeighborhoods({ city: formCity }),
    enabled: !!formCity
  })

  // Quando mudar a cidade no form, limpa o bairro no form
  useEffect(() => {
    if (formCity !== currentCity) {
      setValue('neighborhood', '')
    }
  }, [formCity, setValue, currentCity])

  const onAdvancedSubmit = (data: FilterFormData) => {
    const params = new URLSearchParams(searchParams.toString())

    // Mapeia todos os campos do form para a URL
    const map = {
      cidade: data.city,
      bairro: data.neighborhood,
      tipoImovel: data.type,
      quartos: data.bedrooms,
      suites: data.suites,
      banheiros: data.bathrooms,
      garagem: data.parkingSpots,
      precoMin: data.minPrice,
      precoMax: data.maxPrice
    }

    Object.entries(map).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value)
      else params.delete(key)
    })

    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearAll = () => {
    router.push(pathname)
    reset()
  }

  // Contadores
  const activeAdvancedFilters = [
    searchParams.get('precoMin'),
    searchParams.get('precoMax'),
  ].filter(Boolean).length

  const activeRoomFilters = [currentBedroom, currentBathroom, currentSuite, currentParking].filter(Boolean).length

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap items-center gap-3 w-full justify-between">

        {/* FILTROS DA BARRA (Visíveis em Desktop) */}
        <div className='hidden md:flex gap-3'>

          <Select value={currentCity} onValueChange={(val) => updateFilter('cidade', val)}>
            <SelectTrigger className={`w-[160px] h-10 rounded-full border-gray-300 ${currentCity ? 'bg-[#17375F]/10 border-[#17375F] text-[#17375F] font-medium' : 'bg-white'}`}>
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Cidades</SelectItem>
              {cities?.map((c) => (
                <SelectItem key={c.city} value={c.city}>{c.city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentNeighborhood}
            onValueChange={(val) => updateFilter('bairro', val)}
            disabled={!currentCity || !neighborhoods?.length}
          >
            <SelectTrigger className={`w-[160px] h-10 rounded-full border-gray-300 ${currentNeighborhood ? 'bg-[#17375F]/10 border-[#17375F] text-[#17375F] font-medium' : 'bg-white'}`}>
              <SelectValue placeholder="Bairro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Bairros</SelectItem>
              {neighborhoods?.map((n) => (
                <SelectItem key={n.neighborhood} value={n.neighborhood}>{n.neighborhood}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentType} onValueChange={(val) => updateFilter('tipoImovel', val)}>
            <SelectTrigger className={`w-[180px] h-10 rounded-full border-gray-300 ${currentType ? 'bg-[#17375F]/10 border-[#17375F] text-[#17375F] font-medium' : 'bg-white'}`}>
              <SelectValue placeholder="Tipo de Imóvel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              {types?.map((t) => (
                <SelectItem key={t.id} value={t.description}>{t.description}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Menu Cômodos (Popover Desktop) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`rounded-full border-gray-300 h-10 gap-2 ${activeRoomFilters > 0 ? 'bg-[#17375F]/10 border-[#17375F] text-[#17375F]' : 'bg-white text-gray-600'}`}
              >
                Cômodos
                {activeRoomFilters > 0 && (
                  <Badge className="bg-[#17375F] text-white h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                    {activeRoomFilters}
                  </Badge>
                )}
                <ChevronDown size={16} className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-5" align="start">
              <div className="flex flex-col gap-6">
                <NumberSelector
                  label="Quartos"
                  value={currentBedroom}
                  onChange={(val) => updateFilter('quartos', val)}
                  max={4}
                  icon={BedDouble}
                />
                <Separator />
                <NumberSelector
                  label="Suítes"
                  value={currentSuite}
                  onChange={(val) => updateFilter('suites', val)}
                  max={4}
                  icon={Bath}
                />
                <Separator />
                <NumberSelector
                  label="Banheiros"
                  value={currentBathroom}
                  onChange={(val) => updateFilter('banheiros', val)}
                  max={4}
                  icon={Toilet}
                />
                <Separator />
                <NumberSelector
                  label="Vagas de garagem"
                  value={currentParking}
                  onChange={(val) => updateFilter('garagem', val)}
                  max={4}
                  icon={CarFront}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-full md:w-auto flex items-center justify-end">
          {/* BOTÃO "MAIS FILTROS" (MODAL COMPLETA) */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className={`w-full md:w-auto rounded-full border-gray-300 h-10 gap-2 ml-auto md:ml-0 ${activeAdvancedFilters > 0 ? 'bg-[#17375F]/10 border-[#17375F] text-[#17375F]' : 'text-gray-600'}`}>
                <SlidersHorizontal size={16} />
                <span className="md:hidden">Filtrar Imóveis</span>
                <span className="hidden md:inline">Mais Filtros</span>
                {(activeAdvancedFilters > 0 || activeRoomFilters > 0) && (
                  <Badge className="bg-[#17375F] text-white h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                    {activeAdvancedFilters + activeRoomFilters}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>

            <DialogContent className="w-full h-full max-h-[90vh] md:h-auto md:max-h-[85vh] sm:max-w-[500px] overflow-y-auto flex flex-col">
              <DialogHeader>
                <DialogTitle>Todos os Filtros</DialogTitle>
                <DialogDescription>
                  Refine sua busca detalhadamente.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onAdvancedSubmit)} className="flex flex-col gap-6 py-4 flex-1">

                {/* --- SELETORES PRINCIPAIS --- */}
                <div className="grid grid-cols-1 gap-4">

                  <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
                    <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue placeholder="Selecione a cidade" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todas</SelectItem>
                              {cities?.map((c) => <SelectItem key={c.city} value={c.city}>{c.city}</SelectItem>)}
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
                          <Select onValueChange={field.onChange} value={field.value} disabled={!formCity || formCity === 'all'}>
                            <SelectTrigger><SelectValue placeholder="Selecione o bairro" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos</SelectItem>
                              {formNeighborhoods?.map((n) => <SelectItem key={n.neighborhood} value={n.neighborhood}>{n.neighborhood}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Imóvel</Label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {types?.map((t) => <SelectItem key={t.id} value={t.description}>{t.description}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* --- CÔMODOS --- */}
                <div className="space-y-4">
                  <Label className='text-base'>Cômodos</Label>
                  <Controller
                    name="bedrooms"
                    control={control}
                    render={({ field }) => (
                      <NumberSelector label="Quartos" value={field.value} onChange={field.onChange} icon={BedDouble} />
                    )}
                  />
                  <Controller
                    name="suites"
                    control={control}
                    render={({ field }) => (
                      <NumberSelector label="Suítes" value={field.value} onChange={field.onChange} icon={Bath} />
                    )}
                  />
                  <Controller
                    name="bathrooms"
                    control={control}
                    render={({ field }) => (
                      <NumberSelector label="Banheiros" value={field.value} onChange={field.onChange} icon={Toilet} />
                    )}
                  />
                  <Controller
                    name="parkingSpots"
                    control={control}
                    render={({ field }) => (
                      <NumberSelector label="Vagas" value={field.value} onChange={field.onChange} icon={CarFront} />
                    )}
                  />
                </div>

                <Separator />

                {/* <div className="space-y-3">
                  <Label>Faixa de Preço (R$)</Label>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Mínimo" {...register('minPrice')} type="number" />
                    <span className="text-gray-400">-</span>
                    <Input placeholder="Máximo" {...register('maxPrice')} type="number" />
                  </div>
                </div> */}

                <DialogFooter className="flex-row gap-2 sm:justify-between mt-auto pt-4">
                  <Button type="button" variant="outline" onClick={clearAll} className="flex-1">
                    Limpar
                  </Button>

                  <DialogClose asChild>
                    <Button type="submit" className="bg-[#17375F] flex-1">
                      Aplicar Filtros
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Botão limpar tudo (Atalho fora do modal) */}
          {(currentCity || currentType || currentNeighborhood || activeRoomFilters > 0 || activeAdvancedFilters > 0) && (
            <Button variant="ghost" size="icon" onClick={clearAll} className="h-10 w-10 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 ml-2 hidden md:inline-flex" title="Limpar tudo">
              <X size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}