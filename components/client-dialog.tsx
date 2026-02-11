"use client"

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import api from '@/services/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const clientSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  phone: z.string().min(1, 'Telefone obrigatório'),
  email: z.string().email('Email inválido').or(z.literal('')).optional(),
  description: z.string().min(1, 'Observação obrigatória'),
})

type ClientFormData = z.infer<typeof clientSchema>

interface RealtorOption {
  id: string
  name: string
}

interface ClientToEdit {
  id: string
  name: string
  phone: string
  email?: string | null
  description: string
  realtorId?: string | null
}

interface ClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientToEdit?: ClientToEdit | null
}

export function ClientDialog({ open, onOpenChange, clientToEdit }: ClientDialogProps) {
  const queryClient = useQueryClient()
  const [selectedRealtorId, setSelectedRealtorId] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  })

  const { data: realtors } = useQuery<RealtorOption[]>({
    queryKey: ['realtors'],
    queryFn: async () => {
      const response = await api.get('/corretor')
      return response.data
    },
    enabled: open,
  })

  useEffect(() => {
    if (open) {
      if (clientToEdit) {
        setValue('name', clientToEdit.name)
        setValue('phone', clientToEdit.phone)
        setValue('email', clientToEdit.email ?? '')
        setValue('description', clientToEdit.description)
        setSelectedRealtorId(clientToEdit.realtorId ?? null)
      } else {
        reset({ name: '', phone: '', email: '', description: '' })
        setSelectedRealtorId(null)
      }
    }
  }, [open, clientToEdit, setValue, reset])

  const mutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
      const payload = {
        ...data,
        realtorId: selectedRealtorId,
      }

      if (clientToEdit) {
        await api.put(`/clientes/${clientToEdit.id}`, payload)
      } else {
        await api.post('/clientes', payload)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success(clientToEdit ? 'Cliente atualizado!' : 'Cliente cadastrado!')
      onOpenChange(false)
      reset()
    },
    onError: () => {
      toast.error('Erro ao salvar cliente')
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{clientToEdit ? 'Editar' : 'Novo'} Cliente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input {...register('name')} placeholder="Nome do cliente" />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input {...register('phone')} placeholder="(00) 00000-0000" />
              {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
            </div>

            <div className="space-y-2">
              <Label>Email <span className="text-xs text-gray-400">(opcional)</span></Label>
              <Input {...register('email')} placeholder="email@exemplo.com" type="email" />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Corretor Responsável <span className="text-xs text-gray-400">(opcional)</span></Label>
            <Select
              value={selectedRealtorId ?? 'none'}
              onValueChange={(val) => setSelectedRealtorId(val === 'none' ? null : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um corretor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum (eu sou o responsável)</SelectItem>
                {realtors?.map((realtor) => (
                  <SelectItem key={realtor.id} value={realtor.id}>
                    {realtor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Observações / Interesses</Label>
            <Textarea
              {...register('description')}
              placeholder="Ex: Busca apartamento 3 quartos na região central..."
              rows={4}
            />
            {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#17375F] hover:bg-[#122b4a]" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
