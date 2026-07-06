"use client"

import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, ChevronsUpDown, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react'

import api from '@/services/api'
import {
  crmContactSchema,
  type CrmContactFormData,
  type NotifyInPreset,
  CAPTURE_SOURCE_LABELS,
  PAYMENT_METHOD_LABELS,
  NOTIFY_IN_LABELS,
} from '@/components/crm-contact-schema'

import { CrmStatusTimeline, type ClientStatusLog } from '@/components/crm-status-timeline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'

interface RealtorOption {
  id: string
  name: string
  avatar?: string | null
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
  stage?: { id: string; name: string; color: string; systemKey: string | null } | null
  followUpAt?: string | null
  realtorId?: string | null
  contactDate?: string | null
  captureSource?: string | null
  propertiesId?: string | null
  desiredPropertyType?: string | null
  desiredNeighborhood?: string | null
  priceRangeMax?: string | number | null
  paymentMethod?: string | null
  property?: PropertyOption | null
  createdAt?: string
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

const NOTIFY_PRESET_MONTHS: Partial<Record<NotifyInPreset, number>> = {
  '1m': 1,
  '3m': 3,
  '6m': 6,
}

function computeFollowUpAt(notifyIn?: NotifyInPreset, followUpDate?: string): string | null {
  if (!notifyIn) return null
  if (notifyIn === 'custom') {
    return followUpDate ? new Date(followUpDate).toISOString() : null
  }
  if (notifyIn === '1w') {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return date.toISOString()
  }
  const months = NOTIFY_PRESET_MONTHS[notifyIn]
  return months ? addMonths(new Date(), months).toISOString() : null
}

function buildFormValues(contact?: ContactToEdit | null): CrmContactFormData {
  if (!contact) {
    return {
      name: '',
      phone: '',
      email: '',
      description: '',
      contactDate: new Date().toISOString().slice(0, 10),
    }
  }

  return {
    name: contact.name,
    phone: contact.phone,
    email: contact.email ?? '',
    description: contact.description ?? '',
    contactDate: toDateInputValue(contact.contactDate),
    notifyIn: contact.followUpAt ? 'custom' : undefined,
    followUpDate: toDateInputValue(contact.followUpAt),
    captureSource: (contact.captureSource as CrmContactFormData['captureSource']) ?? undefined,
    desiredPropertyType: contact.desiredPropertyType ?? '',
    desiredNeighborhood: contact.desiredNeighborhood ?? '',
    priceRangeMax: contact.priceRangeMax?.toString() ?? '',
    paymentMethod: (contact.paymentMethod as CrmContactFormData['paymentMethod']) ?? undefined,
    propertiesId: contact.propertiesId ?? undefined,
  }
}

export function CrmContactDialog(props: CrmContactDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      {props.open && (
        <CrmContactDialogContent key={props.contactToEdit?.id ?? 'new'} {...props} />
      )}
    </Dialog>
  )
}

function CrmContactDialogContent({
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
  const [selectedProperty, setSelectedProperty] = useState<PropertyOption | null>(
    contactToEdit?.property ?? null
  )
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
    defaultValues: buildFormValues(contactToEdit),
  })

  const notifyIn = useWatch({ control, name: 'notifyIn' })

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

  const { data: statusLogs } = useQuery<ClientStatusLog[]>({
    queryKey: ['client-status-logs', contactToEdit?.id],
    queryFn: async () => (await api.get(`/clientes/${contactToEdit!.id}/logs`)).data,
    enabled: open && !!contactToEdit,
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
        priceRangeMax: data.priceRangeMax ? Number(data.priceRangeMax) : null,
        paymentMethod: data.paymentMethod ?? null,
        followUpAt: computeFollowUpAt(data.notifyIn, data.followUpDate),
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
    const valid = await trigger(['name', 'phone', 'email', 'followUpDate'])
    if (!valid) return
    setStep(1)
  }

  return (
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
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhum</SelectItem>
                          {realtors?.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={r.avatar ?? undefined} alt={r.name} />
                                  <AvatarFallback className="text-[10px]">
                                    {r.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate">{r.name}</span>
                              </div>
                            </SelectItem>
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
                          <SelectTrigger className="w-full">
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Me notificar em <span className="text-xs text-muted-foreground">(opcional)</span></Label>
                    <Controller
                      control={control}
                      name="notifyIn"
                      render={({ field }) => (
                        <Select
                          value={field.value ?? 'none'}
                          onValueChange={(val) => {
                            field.onChange(val === 'none' ? undefined : val)
                            if (val !== 'custom') setValue('followUpDate', '')
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Não notificar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Não notificar</SelectItem>
                            {Object.entries(NOTIFY_IN_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {notifyIn && notifyIn !== 'custom' && (
                      <p className="text-xs text-muted-foreground">
                        Você será notificado em{' '}
                        {new Date(computeFollowUpAt(notifyIn)!).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>

                  {notifyIn === 'custom' && (
                    <div className="space-y-2">
                      <Label>Data da notificação</Label>
                      <Input
                        {...register('followUpDate')}
                        type="date"
                        min={new Date().toISOString().slice(0, 10)}
                      />
                      {errors.followUpDate && (
                        <p className="text-xs text-red-500">{errors.followUpDate.message}</p>
                      )}
                    </div>
                  )}
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
                    <Label>Valor máximo</Label>
                    <Input {...register('priceRangeMax')} type="number" placeholder="Máximo" />
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
                          <SelectTrigger className="w-full">
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

                {contactToEdit && (
                  <div className="space-y-2">
                    <Label>Linha do tempo</Label>
                    <ScrollArea className="h-48 rounded-md border">
                      <div className="p-4">
                        <CrmStatusTimeline
                          logs={statusLogs ?? []}
                          clientCreatedAt={contactToEdit.createdAt}
                          currentStage={contactToEdit.stage ?? null}
                        />
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
          </div>

        </form>

        {/* Footer fora do form para evitar submit acidental */}
        <div className="h-px bg-border" />
        <div className="flex items-center justify-end gap-2 px-6 py-4">
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>
          )}

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
  )
}
