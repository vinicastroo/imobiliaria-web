"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Loader2 } from 'lucide-react'

import api from '@/services/api'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger, // Mantemos o Trigger opcional
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const typeSchema = z.object({
  description: z.string().min(1, 'A descrição é obrigatória'),
})

type TypeSchema = z.infer<typeof typeSchema>

interface TypeDialogProps {
  // Props opcionais para controlar o modal externamente (modo edição)
  open?: boolean
  onOpenChange?: (open: boolean) => void
  typeToEdit?: { id: string, description: string } | null
}

export function TypeDialog({ open: externalOpen, onOpenChange: setExternalOpen, typeToEdit }: TypeDialogProps) {
  // Estado interno para quando o modal é usado autonomamente (modo criação com botão próprio)
  const [internalOpen, setInternalOpen] = useState(false)

  // Decide quem controla o estado: props externas ou estado interno
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen
  const setIsOpen = setExternalOpen || setInternalOpen

  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TypeSchema>({
    resolver: zodResolver(typeSchema)
  })

  // Preenche o formulário ao abrir para edição
  useEffect(() => {
    if (isOpen) {
      if (typeToEdit) {
        setValue('description', typeToEdit.description)
      } else {
        reset({ description: '' })
      }
    }
  }, [isOpen, typeToEdit, setValue, reset])

  const mutation = useMutation({
    mutationFn: async (data: TypeSchema) => {
      if (typeToEdit) {
        // EDITAR
        await api.put(`/tipo-imovel/${typeToEdit.id}`, data)
      } else {
        // CRIAR
        await api.post('/tipo-imovel', data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['types-property'] })
      toast.success(typeToEdit ? 'Tipo atualizado!' : 'Tipo criado!')
      setIsOpen(false)
      reset()
    },
    onError: () => {
      toast.error('Erro ao salvar tipo de imóvel')
    }
  })

  const onSubmit = async (data: TypeSchema) => {
    await mutation.mutateAsync(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Se não houver controle externo (modo criação padrão no header), 
        mostra o botão de Trigger. 
      */}
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button className="bg-[#17375F] hover:bg-[#122b4a]">
            <Plus className="mr-2 h-4 w-4" /> Novo Tipo
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{typeToEdit ? 'Editar Tipo' : 'Criar Tipo de Imóvel'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Apartamento, Casa, Terreno..."
              {...register('description')}
            />
            {errors.description && (
              <span className="text-xs text-red-500">{errors.description.message}</span>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-[#17375F]">
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}