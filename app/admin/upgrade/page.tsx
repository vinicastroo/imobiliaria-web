'use client'

import { useQuery } from '@tanstack/react-query'
import { Check, X, Crown } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminPage, FormSection, PageHeader } from '@/components/admin/page'
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
  properties: 'Gestão de imóveis',
  realtors: 'Gestão de corretores',
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
        className={`h-2 ${isNearLimit ? '[&>div]:bg-red-500' : '[&>div]:bg-primary'}`}
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
      <AdminPage>
        <PageHeader title="Planos e assinatura" description="Carregando seu plano…" />
        <Skeleton className="mb-8 h-40 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </AdminPage>
    )
  }

  const currentPlan = planUsage?.plan

  return (
    <AdminPage>
      <PageHeader
        title="Planos e assinatura"
        description={
          currentPlan ? `Seu plano atual: ${currentPlan.name}` : 'Nenhum plano associado'
        }
      />

      {planUsage?.usage && (
        <FormSection
          title="Uso do plano"
          description="Quanto do limite do seu plano já está em uso."
          className="mb-8"
        >
          <div className="space-y-4">
            <UsageBar
              label="Usuários"
              current={planUsage.usage.users.current}
              limit={planUsage.usage.users.limit}
            />
            <UsageBar
              label="Corretores"
              current={planUsage.usage.realtors.current}
              limit={planUsage.usage.realtors.limit}
            />
            <UsageBar
              label="Imóveis"
              current={planUsage.usage.properties.current}
              limit={planUsage.usage.properties.limit}
            />
          </div>
        </FormSection>
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
                  ? 'border-primary border-2'
                  : isProfessional
                    ? 'border-primary/40 border-2'
                    : ''
              }`}
            >
              {isProfessional && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary gap-1 text-white">
                    <Crown size={12} />
                    Recomendado
                  </Badge>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white">Plano atual</Badge>
                </div>
              )}

              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-primary mt-2 text-3xl font-bold">
                  {formatPrice(plan.defaultPrice)}
                  <span className="text-sm font-normal text-gray-500">/mês</span>
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usuários</span>
                    <span className="font-medium">{plan.maxUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Corretores</span>
                    <span className="font-medium">{plan.maxRealtors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Imóveis</span>
                    <span className="font-medium">{plan.maxProperties}</span>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  {allFeatureKeys.map((featureKey) => {
                    const hasFeature = plan.features.includes(featureKey)
                    return (
                      <div key={featureKey} className="flex items-center gap-2 text-sm">
                        {hasFeature ? (
                          <Check size={16} className="text-primary shrink-0" />
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
    </AdminPage>
  )
}
