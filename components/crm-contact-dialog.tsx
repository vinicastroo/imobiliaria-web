"use client"

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import api from '@/services/api'
import { crmContactSchema, type CrmContactFormData } from '@/components/crm-contact-schema'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface RealtorOption {
  id: string
  name: string
}

interface ContactToEdit {
  id: string
  name: string
  phone: string
  email?: string | null
  description: string
  status: 'INTERESTED' | 'VISITING' | 'ON_HOLD'
  followUpAt?: string | null
  realtorId?: string | null
}

interface CrmContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contactToEdit?: ContactToEdit | null
  isRealtor?: boolean
  currentRealtorId?: string | null
}

const STATUS_LABELS: Record<string, string> = {
  INTERESTED: 'Interessado',
  VISITING: 'Visitando Imóveis',
  ON_HOLD: 'Em Espera',
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export function CrmContactDialog({
  open,
  onOpenChange,
  contactToEdit,
  isRealtor,
  currentRealtorId,
}: CrmContactDialogProps) {
  const queryClient = useQueryClient()
  const [selectedRealtorId, setSelectedRealtorId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CrmContactFormData>({
    resolver: zodResolver(crmContactSchema),
    defaultValues: { status: 'INTERESTED' },
  })

  const watchedStatus = watch('status')

  const { data: realtors } = useQuery<RealtorOption[]>({
    queryKey: ['realtors'],
    queryFn: async () => (await api.get('/corretor')).data,
    enabled: open && !isRealtor,
  })

  useEffect(() => {
    if (!open) return
    if (contactToEdit) {
      setValue('name', contactToEdit.name)
      setValue('phone', contactToEdit.phone)
      setValue('email', contactToEdit.email ?? '')
      setValue('description', contactToEdit.description)
      setValue('status', contactToEdit.status ?? 'INTERESTED')
      setSelectedRealtorId(contactToEdit.realtorId ?? null)
    } else {
      reset({ name: '', phone: '', email: '', description: '', status: 'INTERESTED' })
      setSelectedRealtorId(isRealtor ? currentRealtorId ?? null : null)
    }
  }, [open, contactToEdit, setValue, reset, isRealtor, currentRealtorId])

  const mutation = useMutation({
    mutationFn: async (data: CrmContactFormData) => {
      let followUpAt: string | null = null
      if (data.status === 'ON_HOLD' && data.followUpMonths) {
        followUpAt = addMonths(new Date(), data.followUpMonths).toISOString()
      }

      const payload = {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        description: data.description,
        status: data.status,
        followUpAt,
        realtorId: selectedRealtorId,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{contactToEdit ? 'Editar' : 'Novo'} Contato</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(
            (data) => mutation.mutate(data),
            (errs) => {
              const first = Object.values(errs).find(Boolean) as { message?: string }
              toast.error(first?.message ?? 'Revise os campos do formulário')
            }
          )}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input {...register('name')} placeholder="Nome do contato" />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input {...register('phone')} placeholder="(00) 00000-0000" />
              {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
            </div>
            <div className="space-y-2">
              <Label>
                Email <span className="text-xs text-gray-400">(opcional)</span>
              </Label>
              <Input {...register('email')} placeholder="email@exemplo.com" type="email" />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-4"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <div key={value} className="flex items-center gap-2">
                      <RadioGroupItem value={value} id={`status-${value}`} />
                      <Label htmlFor={`status-${value}`} className="cursor-pointer font-normal">
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          {watchedStatus === 'ON_HOLD' && (
            <div className="space-y-2 rounded-md border border-amber-200 bg-amber-50 p-3">
              <Label className="text-amber-800">Retomar contato em:</Label>
              <Controller
                control={control}
                name="followUpMonths"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value?.toString()}
                    onValueChange={(v) => field.onChange(Number(v))}
                    className="flex gap-4"
                  >
                    {[1, 3, 6].map((months) => (
                      <div key={months} className="flex items-center gap-2">
                        <RadioGroupItem value={months.toString()} id={`months-${months}`} />
                        <Label htmlFor={`months-${months}`} className="cursor-pointer font-normal text-amber-800">
                          {months} {months === 1 ? 'mês' : 'meses'}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.followUpMonths && (
                <span className="text-xs text-red-500">{errors.followUpMonths.message}</span>
              )}
            </div>
          )}

          {!isRealtor && (
            <div className="space-y-2">
              <Label>
                Corretor Responsável <span className="text-xs text-gray-400">(opcional)</span>
              </Label>
              <Select
                value={selectedRealtorId ?? 'none'}
                onValueChange={(val) => setSelectedRealtorId(val === 'none' ? null : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um corretor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {realtors?.map((realtor) => (
                    <SelectItem key={realtor.id} value={realtor.id}>
                      {realtor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Descrição / Interesses</Label>
            <Textarea
              {...register('description')}
              placeholder="Ex: Busca apartamento 3 quartos na região central..."
              rows={3}
            />
            {errors.description && (
              <span className="text-xs text-red-500">{errors.description.message}</span>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
