"use client"

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import api from '@/services/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
})

type EnterpriseSchema = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemToEdit?: { id: string, name: string, status?: string } | null
}

export function EnterpriseDialog({ open, onOpenChange, itemToEdit }: Props) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, setValue, watch } = useForm<EnterpriseSchema>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    if (open) {
      if (itemToEdit) {
        setValue('name', itemToEdit.name)
      } else {
        reset({ name: '' })
      }
    }
  }, [open, itemToEdit, setValue, reset])

  const mutation = useMutation({
    mutationFn: async (data: EnterpriseSchema) => {
      if (itemToEdit) await api.put(`/empreendimento/${itemToEdit.id}`, data)
      else await api.post('/empreendimento', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprises'] })
      toast.success('Salvo com sucesso!')
      onOpenChange(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{itemToEdit ? 'Editar' : 'Novo'} Empreendimento</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input {...register('name')} placeholder="Ex: Residencial Vista Verde" />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-[#17375F]" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}