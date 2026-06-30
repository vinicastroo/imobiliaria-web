"use client"

import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, ChevronsUpDown, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react'

import api from '@/services/api'
import {
  crmContactSchema,
  type CrmContactFormData,
  CAPTURE_SOURCE_LABELS,
  PAYMENT_METHOD_LABELS,
} from '@/components/crm-contact-schema'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'

interface RealtorOption {
  id: string
  name: string
}

interface PropertyOption {
  id: string
  name: string
  code: number
  slug: string
}

interface ContactToEdit {
  id: string
  name: string
  phone: string
  email?: string | null
  description?: string | null
  status: 'INTERESTED' | 'VISITING' | 'ON_HOLD'
  followUpAt?: string | null
  realtorId?: string | null
  contactDate?: string | null
  captureSource?: string | null
  propertiesId?: string | null
  desiredPropertyType?: string | null
  desiredNeighborhood?: string | null
  priceRangeMin?: number | null
  priceRangeMax?: number | null
  paymentMethod?: string | null
}

interface CrmContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contactToEdit?: ContactToEdit | null
  isRealtor?: boolean
  currentRealtorId?: string | null
}

const STEPS = [
  { title: 'Contato', subtitle: 'Identificação e origem' },
  { title: 'Interesse', subtitle: 'Imóvel e preferências' },
]

function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

function toDateInputValue(isoString?: string | null): string {
  if (!isoString) return ''
  return isoString.slice(0, 10)
}

export function CrmContactDialog({
  open,
  onOpenChange,
  contactToEdit,
  isRealtor,
  currentRealtorId,
}: CrmContactDialogProps) {
  const queryClient = useQueryClient()
  const [step, setStep] = useState(0)
  const [selectedRealtorId, setSelectedRealtorId] = useState<string | null>(
    contactToEdit ? (contactToEdit.realtorId ?? null) : (isRealtor ? currentRealtorId ?? null : null)
  )
  const [propertySearch, setPropertySearch] = useState('')
  const [propertyOpen, setPropertyOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<PropertyOption | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm<CrmContactFormData>({
    resolver: zodResolver(crmContactSchema),
    defaultValues: contactToEdit
      ? {
          name: contactToEdit.name,
          phone: contactToEdit.phone,
          email: contactToEdit.email ?? '',
          description: contactToEdit.description ?? '',
          contactDate: toDateInputValue(contactToEdit.contactDate),
          captureSource: (contactToEdit.captureSource as CrmContactFormData['captureSource']) ?? undefined,
          desiredPropertyType: contactToEdit.desiredPropertyType ?? '',
          desiredNeighborhood: contactToEdit.desiredNeighborhood ?? '',
          priceRangeMin: contactToEdit.priceRangeMin?.toString() ?? '',
          priceRangeMax: contactToEdit.priceRangeMax?.toString() ?? '',
          paymentMethod: (contactToEdit.paymentMethod as CrmContactFormData['paymentMethod']) ?? undefined,
          propertiesId: contactToEdit.propertiesId ?? undefined,
        }
      : {
          name: '',
          phone: '',
          email: '',
          description: '',
          contactDate: new Date().toISOString().slice(0, 10),
        },
  })

  const { data: realtors } = useQuery<RealtorOption[]>({
    queryKey: ['realtors'],
    queryFn: async () => (await api.get('/corretor')).data,
    enabled: open && !isRealtor,
  })

  const { data: propertyResults, isFetching: isSearchingProperties } = useQuery<PropertyOption[]>({
    queryKey: ['property-search', debouncedSearch],
    queryFn: async () => (await api.get('/imovel/search', { params: { q: debouncedSearch } })).data,
    enabled: debouncedSearch.length >= 2,
  })

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => setDebouncedSearch(propertySearch), 300)
    return () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current) }
  }, [propertySearch])

  const mutation = useMutation({
    mutationFn: async (data: CrmContactFormData) => {
      const payload = {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        description: data.description || undefined,
        realtorId: selectedRealtorId,
        contactDate: data.contactDate ? new Date(data.contactDate).toISOString() : null,
        captureSource: data.captureSource ?? null,
        propertiesId: selectedProperty?.id ?? data.propertiesId ?? null,
        desiredPropertyType: data.desiredPropertyType || undefined,
        desiredNeighborhood: data.desiredNeighborhood || undefined,
        priceRangeMin: data.priceRangeMin ? Number(data.priceRangeMin) : null,
        priceRangeMax: data.priceRangeMax ? Number(data.priceRangeMax) : null,
        paymentMethod: data.paymentMethod ?? null,
      }

      if (contactToEdit) {
        await api.put(`/clientes/${contactToEdit.id}`, payload)
      } else {
        await api.post('/clientes', payload)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] })
      toast.success(contactToEdit ? 'Contato atualizado!' : 'Contato criado!')
      onOpenChange(false)
      reset()
    },
    onError: () => {
      toast.error('Erro ao salvar contato')
    },
  })

  async function handleNext() {
    const valid = await trigger(['name', 'phone', 'email'])
    if (!valid) return
    setStep(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>{contactToEdit ? 'Editar' : 'Novo'} Contato</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center px-6 pt-5 pb-4">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                    i < step
                      ? 'bg-primary text-primary-foreground'
                      : i === step
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground'
                  )}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <div className="hidden sm:block">
                  <p className={cn('text-sm font-medium leading-none', i === step ? 'text-foreground' : 'text-muted-foreground')}>
                    {s.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.subtitle}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('mx-3 h-px flex-1 transition-colors', i < step ? 'bg-primary' : 'bg-border')} />
              )}
            </div>
          ))}
        </div>

        <div className="h-px bg-border" />

        <form id="crm-contact-form">
          <div className="px-6 py-5 min-h-[300px]">

            {/* ── Step 1: Contato ── */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome <span className="text-red-500">*</span></Label>
                    <Input {...register('name')} placeholder="Nome completo" />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone <span className="text-red-500">*</span></Label>
                    <Input {...register('phone')} placeholder="(00) 00000-0000" />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>E-mail <span className="text-xs text-muted-foreground">(opcional)</span></Label>
                    <Input {...register('email')} placeholder="email@exemplo.com" type="email" />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Data do contato</Label>
                    <Input {...register('contactDate')} type="date" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {!isRealtor && (
                    <div className="space-y-2">
                      <Label>Corretor responsável <span className="text-xs text-muted-foreground">(opcional)</span></Label>
                      <Select
                        value={selectedRealtorId ?? 'none'}
                        onValueChange={(val) => setSelectedRealtorId(val === 'none' ? null : val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhum</SelectItem>
                          {realtors?.map((r) => (
                            <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Origem da captação <span className="text-xs text-muted-foreground">(opcional)</span></Label>
                    <Controller
                      control={control}
                      name="captureSource"
                      render={({ field }) => (
                        <Select
                          value={field.value ?? 'none'}
                          onValueChange={(val) => field.onChange(val === 'none' ? undefined : val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a origem" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Não informado</SelectItem>
                            {Object.entries(CAPTURE_SOURCE_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Interesse ── */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Por qual imóvel <span className="text-xs text-muted-foreground">(opcional)</span></Label>
                  <Popover open={propertyOpen} onOpenChange={setPropertyOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal"
                      >
                        {selectedProperty
                          ? `#${selectedProperty.code} – ${selectedProperty.name}`
                          : 'Buscar por código, nome ou slug...'}
                        {selectedProperty ? (
                          <X
                            className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedProperty(null)
                              setValue('propertiesId', null)
                            }}
                          />
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Código, nome ou slug..."
                          value={propertySearch}
                          onValueChange={setPropertySearch}
                        />
                        <CommandList>
                          {isSearchingProperties && (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                          )}
                          {!isSearchingProperties && debouncedSearch.length < 2 && (
                            <CommandEmpty>Digite pelo menos 2 caracteres.</CommandEmpty>
                          )}
                          {!isSearchingProperties && debouncedSearch.length >= 2 && (!propertyResults || propertyResults.length === 0) && (
                            <CommandEmpty>Nenhum imóvel encontrado.</CommandEmpty>
                          )}
                          {propertyResults && propertyResults.length > 0 && (
                            <CommandGroup>
                              {propertyResults.map((prop) => (
                                <CommandItem
                                  key={prop.id}
                                  value={prop.id}
                                  onSelect={() => {
                                    setSelectedProperty(prop)
                                    setValue('propertiesId', prop.id)
                                    setPropertyOpen(false)
                                  }}
                                >
                                  <Check className={cn('mr-2 h-4 w-4', selectedProperty?.id === prop.id ? 'opacity-100' : 'opacity-0')} />
                                  <span className="font-medium">#{prop.code}</span>
                                  <span className="ml-2 truncate text-muted-foreground">{prop.name}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de imóvel desejado</Label>
                    <Input {...register('desiredPropertyType')} placeholder="Ex: Apartamento, Casa..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Bairro e cidade</Label>
                    <Input {...register('desiredNeighborhood')} placeholder="Ex: Centro, São Paulo" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Faixa de preço</Label>
                    <div className="flex items-center gap-2">
                      <Input {...register('priceRangeMin')} type="number" placeholder="Mínimo" />
                      <span className="shrink-0 text-muted-foreground text-sm">–</span>
                      <Input {...register('priceRangeMax')} type="number" placeholder="Máximo" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Forma de pagamento</Label>
                    <Controller
                      control={control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <Select
                          value={field.value ?? 'none'}
                          onValueChange={(val) => field.onChange(val === 'none' ? undefined : val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Não informado</SelectItem>
                            {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Observações <span className="text-xs text-muted-foreground">(opcional)</span></Label>
                  <Textarea
                    {...register('description')}
                    placeholder="Informações adicionais sobre o cliente, preferências específicas..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            )}
          </div>

        </form>

        {/* Footer fora do form para evitar submit acidental */}
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between px-6 py-4">
          <Button
            variant="ghost"
            onClick={step === 0 ? () => onOpenChange(false) : () => setStep(0)}
          >
            {step === 0 ? 'Cancelar' : <><ChevronLeft className="h-4 w-4 mr-1" /> Anterior</>}
          </Button>

          {step === 0 ? (
            <Button onClick={handleNext}>
              Próximo <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              disabled={mutation.isPending}
              onClick={() => handleSubmit(
                (data) => mutation.mutate(data),
                (errs) => {
                  const first = Object.values(errs).find(Boolean) as { message?: string }
                  toast.error(first?.message ?? 'Revise os campos do formulário')
                }
              )()}
            >
              {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Salvar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
