"use client"

import { useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'

import api from '@/services/api'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
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

import type { AdminAgency, AdminPlan } from '@/types/admin'

const ownerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .optional()
    .or(z.literal('')),
})

type OwnerFormData = z.infer<typeof ownerSchema>

const agencySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z
    .string()
    .toLowerCase()
    .regex(/^[a-z0-9-]*$/, 'Apenas letras minúsculas, números e hífens')
    .optional()
    .or(z.literal(''))
    .nullable(),
  customDomain: z
    .string()
    .toLowerCase()
    .regex(
      /^([a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+)?$/,
      'Domínio inválido (ex: imoveisgilli.com.br)'
    )
    .optional()
    .or(z.literal(''))
    .nullable(),
  cnpj: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .pipe(
      z.string().refine((val) => val === '' || val.length === 14, 'CNPJ deve ter 14 dígitos')
    )
    .optional()
    .or(z.literal(''))
    .nullable(),
})

const subscriptionSchema = z.object({
  planId: z.string().uuid('Selecione um plano'),
  manualBilling: z.boolean(),
  customPrice: z.number().positive('Preço deve ser positivo').optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'CANCELED', 'EXPIRED']),
})

type AgencyFormData = z.infer<typeof agencySchema>
type SubscriptionFormData = z.infer<typeof subscriptionSchema>

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

interface AgencyEditSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agency: AdminAgency | null
}

export function AgencyEditSheet({ open, onOpenChange, agency }: AgencyEditSheetProps) {
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register: registerAgency,
    handleSubmit: handleAgencySubmit,
    reset: resetAgency,
    formState: { errors: agencyErrors },
  } = useForm<AgencyFormData>({
    resolver: zodResolver(agencySchema),
    defaultValues: { name: '', slug: '', customDomain: '', cnpj: '' },
  })

  const {
    register: registerOwner,
    handleSubmit: handleOwnerSubmit,
    reset: resetOwner,
    formState: { errors: ownerErrors },
  } = useForm<OwnerFormData>({
    resolver: zodResolver(ownerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const {
    register: registerSub,
    handleSubmit: handleSubSubmit,
    control: subControl,
    watch: watchSub,
    reset: resetSub,
    formState: { errors: subErrors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      planId: '',
      manualBilling: false,
      customPrice: undefined,
      status: 'ACTIVE',
    },
  })

  useEffect(() => {
    if (open && agency) {
      resetAgency({
        name: agency.name,
        slug: agency.slug ?? '',
        customDomain: agency.customDomain ?? '',
        cnpj: agency.cnpj ?? '',
      })

      if (agency.owner) {
        resetOwner({
          name: agency.owner.name,
          email: agency.owner.email,
          password: '',
        })
      }

      if (agency.subscription) {
        resetSub({
          planId: agency.subscription.planId,
          manualBilling: agency.subscription.manualBilling,
          customPrice: agency.subscription.customPrice
            ? Number(agency.subscription.customPrice)
            : undefined,
          status: agency.subscription.status,
        })
      }
    }
  }, [open, agency, resetAgency, resetOwner, resetSub])

  const { data: plans } = useQuery<AdminPlan[]>({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const response = await api.get('/admin/planos')
      return response.data
    },
    enabled: open,
  })

  const activePlans = useMemo(() => plans?.filter((p) => p.active) ?? [], [plans])

  const manualBilling = watchSub('manualBilling')

  const ownerMutation = useMutation({
    mutationFn: async (data: OwnerFormData) => {
      await api.put(`/admin/agencies/${agency?.id}/owner`, {
        name: data.name,
        email: data.email,
        password: data.password || undefined,
      })
    },
  })

  const agencyMutation = useMutation({
    mutationFn: async (data: AgencyFormData) => {
      await api.put(`/admin/agencies/${agency?.id}`, {
        name: data.name,
        slug: data.slug || null,
        customDomain: data.customDomain || null,
        cnpj: data.cnpj || null,
      })
    },
  })

  const subscriptionMutation = useMutation({
    mutationFn: async (data: SubscriptionFormData) => {
      await api.put(`/admin/agencies/${agency?.id}/subscription`, {
        planId: data.planId,
        manualBilling: data.manualBilling,
        customPrice: data.manualBilling ? null : (data.customPrice ?? null),
        status: data.status,
      })
    },
  })

  async function onSave(
    agencyData: AgencyFormData,
    ownerData: OwnerFormData,
    subData?: SubscriptionFormData,
  ) {
    try {
      const promises: Promise<void>[] = [
        agencyMutation.mutateAsync(agencyData),
        ownerMutation.mutateAsync(ownerData),
      ]
      if (agency?.subscription && subData) {
        promises.push(subscriptionMutation.mutateAsync(subData))
      }
      await Promise.all(promises)
      queryClient.invalidateQueries({ queryKey: ['admin-agencies'] })
      toast.success('Imobiliária atualizada com sucesso!')
      onOpenChange(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.response?.data?.message || 'Erro ao atualizar imobiliária')
    }
  }

  const isPending =
    agencyMutation.isPending || ownerMutation.isPending || subscriptionMutation.isPending

  function handleFormSubmit() {
    handleAgencySubmit((agencyData) => {
      handleOwnerSubmit((ownerData) => {
        if (agency?.subscription) {
          handleSubSubmit((subData) => {
            onSave(agencyData, ownerData, subData)
          })()
        } else {
          onSave(agencyData, ownerData)
        }
      })()
    })()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Imobiliária</SheetTitle>
          <SheetDescription>
            Atualize os dados da imobiliária e da assinatura.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-4 mt-4">
          {/* Agency Details */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-primary">Dados da Imobiliária</p>

            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome da Imobiliária</Label>
              <Input
                id="edit-name"
                placeholder="Ex: Imobiliária Central"
                {...registerAgency('name')}
              />
              {agencyErrors.name && (
                <span className="text-xs text-red-500">{agencyErrors.name.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-slug">
                Subdomínio <span className="text-xs text-gray-400">(opcional)</span>
              </Label>
              <div className="flex items-center gap-1">
                <Input
                  id="edit-slug"
                  placeholder="minha-imobiliaria"
                  {...registerAgency('slug')}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  .{process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? 'codelabz.com.br'}
                </span>
              </div>
              {agencyErrors.slug && (
                <span className="text-xs text-red-500">{agencyErrors.slug.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-customDomain">
                Domínio Personalizado <span className="text-xs text-gray-400">(opcional)</span>
              </Label>
              <Input
                id="edit-customDomain"
                placeholder="imoveisgilli.com.br"
                {...registerAgency('customDomain')}
              />
              {agencyErrors.customDomain && (
                <span className="text-xs text-red-500">{agencyErrors.customDomain.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cnpj">
                CNPJ <span className="text-xs text-gray-400">(opcional)</span>
              </Label>
              <Input
                id="edit-cnpj"
                placeholder="00.000.000/0000-00"
                {...registerAgency('cnpj')}
              />
              {agencyErrors.cnpj && (
                <span className="text-xs text-red-500">{agencyErrors.cnpj.message}</span>
              )}
            </div>
          </div>

          <Separator />

          {/* Owner / Responsável */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-primary">Dados do Responsável</p>

            <div className="space-y-2">
              <Label htmlFor="edit-owner-name">Nome</Label>
              <Input
                id="edit-owner-name"
                placeholder="Nome completo"
                {...registerOwner('name')}
              />
              {ownerErrors.name && (
                <span className="text-xs text-red-500">{ownerErrors.name.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-owner-email">Email</Label>
              <Input
                id="edit-owner-email"
                type="email"
                placeholder="email@exemplo.com"
                {...registerOwner('email')}
              />
              {ownerErrors.email && (
                <span className="text-xs text-red-500">{ownerErrors.email.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-owner-password">
                Nova Senha <span className="text-xs text-gray-400">(deixe em branco para manter)</span>
              </Label>
              <div className="relative">
                <Input
                  id="edit-owner-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  {...registerOwner('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {ownerErrors.password && (
                <span className="text-xs text-red-500">{ownerErrors.password.message}</span>
              )}
            </div>
          </div>

          {agency?.subscription && (
            <>
              <Separator />

              <div className="space-y-4">
                <p className="text-sm font-medium text-primary">Assinatura</p>

                <div className="space-y-2">
                  <Label>Plano</Label>
                  <Controller
                    name="planId"
                    control={subControl}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>
                        <SelectContent>
                          {activePlans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name} —{' '}
                              {Number(plan.defaultPrice).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {subErrors.planId && (
                    <span className="text-xs text-red-500">{subErrors.planId.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Controller
                    name="status"
                    control={subControl}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pendente</SelectItem>
                          <SelectItem value="ACTIVE">Ativo</SelectItem>
                          <SelectItem value="CANCELED">Cancelado</SelectItem>
                          <SelectItem value="EXPIRED">Expirado</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <Controller
                  name="manualBilling"
                  control={subControl}
                  render={({ field }) => (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                      <span className="text-sm">Cobrança manual</span>
                    </label>
                  )}
                />

                {manualBilling && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    Cobrança manual ativada — Stripe ignorado
                  </Badge>
                )}

                {!manualBilling && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-customPrice">
                      Preço Negociado (R$){' '}
                      <span className="text-xs text-gray-400">(opcional)</span>
                    </Label>
                    <Input
                      id="edit-customPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...registerSub('customPrice', {
                        setValueAs: (v) => (v === '' || v === undefined ? undefined : parseFloat(v)),
                      })}
                    />
                    {subErrors.customPrice && (
                      <span className="text-xs text-red-500">
                        {subErrors.customPrice.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="pt-2">
            <Button
              type="button"
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleFormSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
