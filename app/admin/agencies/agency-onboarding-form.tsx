"use client"

import { useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'

import api from '@/services/api'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

import type { AdminPlan, AgencyCreateResponse } from '@/types/admin'

const onboardingSchema = z.object({
  agencyName: z.string().min(1, 'Nome da imobiliária é obrigatório'),
  cnpj: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .pipe(
      z.string().refine((val) => val === '' || val.length === 14, 'CNPJ deve ter 14 dígitos')
    )
    .optional()
    .or(z.literal('')),
  userName: z.string().min(1, 'Nome do responsável é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  planId: z.string().uuid('Selecione um plano'),
  customPrice: z.coerce.number().positive('Preço deve ser positivo').optional(),
})

type OnboardingFormData = z.infer<typeof onboardingSchema>

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

interface AgencyOnboardingFormProps {
  onSuccess: (paymentLink: string | null) => void
}

export function AgencyOnboardingForm({ onSuccess }: AgencyOnboardingFormProps) {
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)
  const [hasCustomPrice, setHasCustomPrice] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      agencyName: '',
      cnpj: '',
      userName: '',
      email: '',
      password: '',
      planId: '',
      customPrice: undefined,
    },
  } as const)

  const { data: plans } = useQuery<AdminPlan[]>({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const response = await api.get('/admin/planos')
      return response.data
    },
  })

  const activePlans = useMemo(
    () => plans?.filter((p) => p.active) ?? [],
    [plans]
  )

  const selectedPlanId = watch('planId')
  const customPriceValue = watch('customPrice')

  const selectedPlan = useMemo(
    () => activePlans.find((p) => p.id === selectedPlanId),
    [activePlans, selectedPlanId]
  )

  const discountPercentage = useMemo(() => {
    if (!selectedPlan || !hasCustomPrice || !customPriceValue) return null
    const defaultPrice = Number(selectedPlan.defaultPrice)
    const customPrice = Number(customPriceValue)
    if (customPrice >= defaultPrice) return null
    return Math.round(((defaultPrice - customPrice) / defaultPrice) * 100)
  }, [selectedPlan, hasCustomPrice, customPriceValue])

  const mutation = useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      const payload = {
        agency: {
          name: data.agencyName,
          cnpj: data.cnpj || undefined,
        },
        user: {
          name: data.userName,
          email: data.email,
          password: data.password,
        },
        planId: data.planId,
        customPrice: hasCustomPrice ? data.customPrice : undefined,
      }
      const response = await api.post<AgencyCreateResponse>('/admin/agencies', payload)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-agencies'] })
      toast.success('Imobiliária cadastrada com sucesso!')
      reset()
      setHasCustomPrice(false)
      onSuccess(data.paymentLink)
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar imobiliária')
    },
  })

  const onSubmit = (data: OnboardingFormData) => {
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4">
      <div className="space-y-4">
        <p className="text-sm font-medium text-[#17375F]">Dados da Imobiliária</p>

        <div className="space-y-2">
          <Label htmlFor="agencyName">Nome da Imobiliária</Label>
          <Input
            id="agencyName"
            placeholder="Ex: Imobiliária Central"
            {...register('agencyName')}
          />
          {errors.agencyName && (
            <span className="text-xs text-red-500">{errors.agencyName.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cnpj">
            CNPJ <span className="text-xs text-gray-400">(opcional)</span>
          </Label>
          <Input
            id="cnpj"
            placeholder="00.000.000/0000-00"
            {...register('cnpj')}
          />
          {errors.cnpj && (
            <span className="text-xs text-red-500">{errors.cnpj.message}</span>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <p className="text-sm font-medium text-[#17375F]">Usuário Administrador</p>

        <div className="space-y-2">
          <Label htmlFor="userName">Nome do Responsável</Label>
          <Input
            id="userName"
            placeholder="Nome completo"
            {...register('userName')}
          />
          {errors.userName && (
            <span className="text-xs text-red-500">{errors.userName.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@exemplo.com"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-500">{errors.password.message}</span>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <p className="text-sm font-medium text-[#17375F]">Plano e Assinatura</p>

        <div className="space-y-2">
          <Label>Plano</Label>
          <Controller
            name="planId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {activePlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} — {Number(plan.defaultPrice).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.planId && (
            <span className="text-xs text-red-500">{errors.planId.message}</span>
          )}
        </div>

        {selectedPlan && (
          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-sm">
            <span className="text-muted-foreground">Preço de tabela: </span>
            <span className="font-medium text-[#17375F]">
              {Number(selectedPlan.defaultPrice).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={hasCustomPrice}
            onCheckedChange={(checked) => setHasCustomPrice(checked === true)}
          />
          <span className="text-sm">Aplicar preço negociado</span>
        </label>

        {hasCustomPrice && (
          <div className="space-y-2">
            <Label htmlFor="customPrice">Preço Negociado (R$)</Label>
            <Input
              id="customPrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('customPrice')}
            />
            {errors.customPrice && (
              <span className="text-xs text-red-500">{errors.customPrice.message}</span>
            )}
            {discountPercentage !== null && discountPercentage > 0 && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {discountPercentage}% de desconto
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-[#17375F] hover:bg-[#122b4a]"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cadastrando...
            </>
          ) : (
            'Cadastrar Imobiliária'
          )}
        </Button>
      </div>
    </form>
  )
}
