"use client"

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import api from '@/services/api'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'

import type { AdminPlan } from '@/types/admin'

const AVAILABLE_FEATURES = [
  { value: 'properties', label: 'Imóveis' },
  { value: 'realtors', label: 'Corretores' },
  { value: 'type_properties', label: 'Tipos de Imóvel' },
  { value: 'enterprises', label: 'Empreendimentos' },
  { value: 'clients', label: 'Clientes' },
] as const

const planEditSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  defaultPrice: z.coerce.number().positive('Preço deve ser positivo'),
  maxUsers: z.coerce.number().int().positive('Deve ser maior que 0'),
  maxRealtors: z.coerce.number().int().positive('Deve ser maior que 0'),
  maxProperties: z.coerce.number().int().positive('Deve ser maior que 0'),
  features: z.array(z.string()),
  active: z.boolean(),
})

type PlanEditFormData = z.infer<typeof planEditSchema>

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

interface PlanEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planToEdit: AdminPlan | null
}

export function PlanEditDialog({ open, onOpenChange, planToEdit }: PlanEditDialogProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PlanEditFormData>({
    resolver: zodResolver(planEditSchema),
    defaultValues: {
      name: '',
      defaultPrice: 0,
      maxUsers: 1,
      maxRealtors: 1,
      maxProperties: 1,
      features: [],
      active: true,
    },
  })

  useEffect(() => {
    if (open && planToEdit) {
      reset({
        name: planToEdit.name,
        defaultPrice: Number(planToEdit.defaultPrice),
        maxUsers: planToEdit.maxUsers,
        maxRealtors: planToEdit.maxRealtors,
        maxProperties: planToEdit.maxProperties,
        features: planToEdit.features,
        active: planToEdit.active,
      })
    }
  }, [open, planToEdit, reset])

  const mutation = useMutation({
    mutationFn: async (data: PlanEditFormData) => {
      await api.put(`/admin/planos/${planToEdit?.id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] })
      toast.success('Plano atualizado com sucesso!')
      onOpenChange(false)
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar plano')
    },
  })

  const onSubmit = (data: PlanEditFormData) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Plano</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="Nome do plano" {...register('name')} />
            {errors.name && (
              <span className="text-xs text-red-500">{errors.name.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultPrice">Preço Padrão (R$)</Label>
            <Input
              id="defaultPrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('defaultPrice')}
            />
            {errors.defaultPrice && (
              <span className="text-xs text-red-500">{errors.defaultPrice.message}</span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUsers">Max Usuários</Label>
              <Input id="maxUsers" type="number" {...register('maxUsers')} />
              {errors.maxUsers && (
                <span className="text-xs text-red-500">{errors.maxUsers.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxRealtors">Max Corretores</Label>
              <Input id="maxRealtors" type="number" {...register('maxRealtors')} />
              {errors.maxRealtors && (
                <span className="text-xs text-red-500">{errors.maxRealtors.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxProperties">Max Imóveis</Label>
              <Input id="maxProperties" type="number" {...register('maxProperties')} />
              {errors.maxProperties && (
                <span className="text-xs text-red-500">{errors.maxProperties.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Funcionalidades</Label>
            <Controller
              name="features"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_FEATURES.map((feature) => (
                    <label
                      key={feature.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={field.value.includes(feature.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, feature.value])
                          } else {
                            field.onChange(field.value.filter((v) => v !== feature.value))
                          }
                        }}
                      />
                      <span className="text-sm">{feature.label}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="flex items-center gap-3">
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label>Plano ativo</Label>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#17375F] hover:bg-[#122b4a]"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
