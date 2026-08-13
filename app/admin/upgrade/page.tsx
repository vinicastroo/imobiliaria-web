'use client'

import { useQuery } from '@tanstack/react-query'
import { Check, X, Crown } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

import { usePlanUsage } from '@/hooks/use-plan-usage'
import api from '@/services/api'

interface Plan {
  id: string
  name: string
  defaultPrice: string
  maxUsers: number
  maxRealtors: number
  maxProperties: number
  features: string[]
}

const featureLabels: Record<string, string> = {
  properties: 'Gestao de Imoveis',
  realtors: 'Gestao de Corretores',
  type_properties: 'Tipos de Imovel',
  enterprises: 'Empreendimentos',
  clients: 'Clientes',
}

const allFeatureKeys = ['properties', 'realtors', 'type_properties', 'enterprises', 'clients']

function formatPrice(price: string | number) {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function UsageBar({
  label,
  current,
  limit,
}: {
  label: string
  current: number
  limit: number | null
}) {
  if (limit === null) return null

  const percentage = limit > 0 ? Math.min((current / limit) * 100, 100) : 0
  const isNearLimit = percentage >= 80

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className={isNearLimit ? 'font-medium text-red-600' : 'text-gray-500'}>
          {current}/{limit}
        </span>
      </div>
      <Progress
        value={percentage}
        className={`h-2 ${isNearLimit ? '[&>div]:bg-red-500' : '[&>div]:bg-blue-500'}`}
      />
    </div>
  )
}

export default function UpgradePage() {
  const { data: planUsage, isLoading: isLoadingUsage } = usePlanUsage()

  const { data: plans, isLoading: isLoadingPlans } = useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data } = await api.get<Plan[]>('/planos')
      return data
    },
  })

  if (isLoadingUsage || isLoadingPlans) {
    return (
      <div className="space-y-6 p-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    )
  }

  const currentPlan = planUsage?.plan

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Planos e Assinatura</h1>
        <p className="mt-1 text-gray-500">
          {currentPlan ? `Seu plano atual: ${currentPlan.name}` : 'Nenhum plano associado'}
        </p>
      </div>

      {planUsage?.usage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Uso do Plano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UsageBar
              label="Usuarios"
              current={planUsage.usage.users.current}
              limit={planUsage.usage.users.limit}
            />
            <UsageBar
              label="Corretores"
              current={planUsage.usage.realtors.current}
              limit={planUsage.usage.realtors.limit}
            />
            <UsageBar
              label="Imoveis"
              current={planUsage.usage.properties.current}
              limit={planUsage.usage.properties.limit}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans?.map((plan) => {
          const isCurrent = currentPlan?.id === plan.id
          const isProfessional = plan.name === 'Professional'

          return (
            <Card
              key={plan.id}
              className={`relative ${
                isCurrent
                  ? 'border-2 border-blue-500'
                  : isProfessional
                    ? 'border-2 border-[#17375F]'
                    : ''
              }`}
            >
              {isProfessional && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 bg-[#17375F] text-white">
                    <Crown size={12} />
                    Mais popular
                  </Badge>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">Plano atual</Badge>
                </div>
              )}

              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="mt-2 text-3xl font-bold text-[#17375F]">
                  {formatPrice(plan.defaultPrice)}
                  <span className="text-sm font-normal text-gray-500">/mes</span>
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usuarios</span>
                    <span className="font-medium">{plan.maxUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Corretores</span>
                    <span className="font-medium">{plan.maxRealtors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Imoveis</span>
                    <span className="font-medium">{plan.maxProperties}</span>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  {allFeatureKeys.map((featureKey) => {
                    const hasFeature = plan.features.includes(featureKey)
                    return (
                      <div key={featureKey} className="flex items-center gap-2 text-sm">
                        {hasFeature ? (
                          <Check size={16} className="shrink-0 text-green-500" />
                        ) : (
                          <X size={16} className="shrink-0 text-gray-300" />
                        )}
                        <span className={hasFeature ? 'text-gray-700' : 'text-gray-400'}>
                          {featureLabels[featureKey] ?? featureKey}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <Button
                  className="w-full"
                  variant={isCurrent ? 'outline' : 'default'}
                  disabled={isCurrent}
                >
                  {isCurrent ? 'Plano atual' : 'Entrar em contato'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
