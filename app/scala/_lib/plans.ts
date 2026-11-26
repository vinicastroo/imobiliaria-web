import { apiUrl } from '@/lib/api-url'

export interface PublicPlan {
  id: string
  name: string
  defaultPrice: string
  maxUsers: number
  maxRealtors: number
  maxProperties: number
  features: string[]
  allowCustomDomain: boolean
}

/** Planos públicos da landing. null = API fora do ar; a seção mostra "fale com a gente". */
export async function getPublicPlans(): Promise<PublicPlan[] | null> {
  try {
    const res = await fetch(`${apiUrl('http://localhost:3333')}/platform/plans`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const plans = (await res.json()) as PublicPlan[]
    return plans.length ? plans : null
  } catch {
    return null
  }
}

export function formatPlanPrice(value: string): string {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/** -1 = ilimitado no banco. */
export function formatLimit(value: number, singular: string, plural: string): string {
  if (value < 0) return `${plural} ilimitados`
  return `Até ${value} ${value === 1 ? singular : plural}`
}

export const FEATURE_LABELS: Record<string, string> = {
  properties: 'Gestão de imóveis',
  realtors: 'Gestão de corretores',
  type_properties: 'Tipos de imóvel personalizados',
  enterprises: 'Empreendimentos e lançamentos',
  clients: 'CRM de clientes (funil em kanban)',
}
