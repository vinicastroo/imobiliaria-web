'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, Loader2, Plus, ExternalLink, PowerOff, Power } from 'lucide-react'
import { toast } from 'sonner'

import api from '@/services/api'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AdminPage, DataCard, PageHeader } from '@/components/admin/page'
import {
  EmptyState,
  RowActions,
  TableMessageRow,
  TableSkeletonRows,
} from '@/components/admin/states'

import { AgencyOnboardingSheet } from './agency-onboarding-sheet'
import { AgencyEditSheet } from './agency-edit-sheet'
import type { AdminAgency } from '@/types/admin'

const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? 'codelabz.com.br'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''
const IS_LOCAL_DEV = BASE_URL.includes('localhost') || BASE_URL.includes('127.0.0.1')

/** Returns the backoffice URL for an agency.
 *  - Local dev: always uses BASE_URL (tenant context comes from NEXT_PUBLIC_AGENCY_ID)
 *  - Production: custom domain > slug subdomain > null (no link)
 */
function getBackofficeUrl(agency: AdminAgency): string | null {
  if (IS_LOCAL_DEV) return `${BASE_URL}/admin/imoveis`
  if (agency.customDomain) return `https://${agency.customDomain}/admin/imoveis`
  if (agency.slug) return `https://${agency.slug}.${PLATFORM_DOMAIN}/admin/imoveis`
  return null
}

function formatCurrency(value: string | number) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatCnpj(cnpj: string) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

const subscriptionStatusConfig = {
  PENDING: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  ACTIVE: { label: 'Ativo', className: 'bg-green-100 text-green-800 border-green-200' },
  CANCELED: { label: 'Cancelado', className: 'bg-red-100 text-red-800 border-red-200' },
  EXPIRED: { label: 'Expirado', className: 'bg-gray-100 text-gray-600 border-gray-200' },
} as const

export default function AgenciesPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [agencyToEdit, setAgencyToEdit] = useState<AdminAgency | null>(null)
  const queryClient = useQueryClient()

  const { data: agencies, isLoading } = useQuery<AdminAgency[]>({
    queryKey: ['admin-agencies'],
    queryFn: async () => {
      const response = await api.get('/admin/agencies')
      return response.data
    },
  })

  const toggleStatus = useMutation({
    mutationFn: async (agencyId: string) => {
      const response = await api.patch(`/admin/agencies/${agencyId}/status`)
      return response.data as { id: string; active: boolean }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-agencies'] })
      toast.success(data.active ? 'Imobiliária ativada' : 'Imobiliária desativada')
    },
    onError: () => {
      toast.error('Erro ao alterar status da imobiliária')
    },
  })

  return (
    <AdminPage width="wide">
      <PageHeader
        title="Imobiliárias"
        description="Imobiliárias cadastradas na plataforma, com plano, assinatura e uso."
        actions={
          <Button onClick={() => setIsSheetOpen(true)}>
            <Plus className="h-4 w-4" /> Nova imobiliária
          </Button>
        }
      />

      <DataCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome / Subdomínio</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Preço Efetivo</TableHead>
              <TableHead className="text-center">Assinatura</TableHead>
              <TableHead className="text-center">Uso</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonRows columns={8} />
            ) : agencies && agencies.length > 0 ? (
              agencies.map((agency) => {
                const sub = agency.subscription
                const hasDiscount = sub?.customPrice && sub.customPrice !== sub.snapshotPrice
                const isToggling = toggleStatus.isPending && toggleStatus.variables === agency.id

                return (
                  <TableRow key={agency.id} className={agency.active ? '' : 'opacity-60'}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{agency.name}</span>
                        {agency.customDomain ? (
                          <span className="text-muted-foreground text-xs">
                            {agency.customDomain}
                          </span>
                        ) : agency.slug ? (
                          <span className="text-muted-foreground text-xs">
                            {agency.slug}.{PLATFORM_DOMAIN}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">sem domínio</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {agency.cnpj ? formatCnpj(agency.cnpj) : '—'}
                    </TableCell>
                    <TableCell>
                      {sub ? (
                        sub.planName
                      ) : (
                        <Badge className="border-transparent bg-gray-100 text-gray-600">
                          Sem plano
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {sub ? (
                        <div className="flex items-center gap-2">
                          <span className="tabular-nums">{formatCurrency(sub.effectivePrice)}</span>
                          {hasDiscount && (
                            <Badge className="border-transparent bg-emerald-50 text-emerald-700">
                              Desconto
                            </Badge>
                          )}
                        </div>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {sub ? (
                        <div className="flex flex-wrap items-center justify-center gap-1">
                          <Badge className={subscriptionStatusConfig[sub.status].className}>
                            {subscriptionStatusConfig[sub.status].label}
                          </Badge>
                          {sub.manualBilling && (
                            <Badge className="bg-primary/10 text-primary border-transparent">
                              Manual
                            </Badge>
                          )}
                        </div>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-muted-foreground flex justify-center gap-3 text-xs tabular-nums">
                        <span title="Usuários">{agency.usage.users} usuários</span>
                        <span title="Corretores">{agency.usage.realtors} corretores</span>
                        <span title="Imóveis">{agency.usage.properties} imóveis</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          agency.active
                            ? 'border-transparent bg-emerald-50 text-emerald-700'
                            : 'border-transparent bg-gray-100 text-gray-600'
                        }
                      >
                        {isToggling && <Loader2 className="h-3 w-3 animate-spin" />}
                        {agency.active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <RowActions
                        label={agency.name}
                        onEdit={() => setAgencyToEdit(agency)}
                        extra={[
                          ...(getBackofficeUrl(agency)
                            ? [
                                {
                                  label: 'Acessar painel',
                                  icon: ExternalLink,
                                  onSelect: () =>
                                    window.open(
                                      getBackofficeUrl(agency)!,
                                      '_blank',
                                      'noopener,noreferrer',
                                    ),
                                },
                              ]
                            : []),
                          {
                            label: agency.active ? 'Desativar' : 'Ativar',
                            icon: agency.active ? PowerOff : Power,
                            onSelect: () => {
                              if (!isToggling) toggleStatus.mutate(agency.id)
                            },
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableMessageRow colSpan={8}>
                <EmptyState
                  icon={Building2}
                  title="Nenhuma imobiliária cadastrada"
                  description="Cadastre a primeira imobiliária para ela ganhar o painel e o site."
                  action={
                    <Button onClick={() => setIsSheetOpen(true)}>
                      <Plus className="h-4 w-4" /> Nova imobiliária
                    </Button>
                  }
                />
              </TableMessageRow>
            )}
          </TableBody>
        </Table>
      </DataCard>

      <AgencyOnboardingSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      <AgencyEditSheet
        open={!!agencyToEdit}
        onOpenChange={(v) => !v && setAgencyToEdit(null)}
        agency={agencyToEdit}
      />
    </AdminPage>
  )
}
