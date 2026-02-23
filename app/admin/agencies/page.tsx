"use client"

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus, ExternalLink, PowerOff, Power, Pencil } from 'lucide-react'
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
import { BackLink } from '@/components/back-link'

import { AgencyOnboardingSheet } from './agency-onboarding-sheet'
import { AgencyEditSheet } from './agency-edit-sheet'
import type { AdminAgency } from '@/types/admin'

const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? 'codelabz.com.br'
const BASE_URL        = process.env.NEXT_PUBLIC_BASE_URL ?? ''
const IS_LOCAL_DEV    = BASE_URL.includes('localhost') || BASE_URL.includes('127.0.0.1')

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
  PENDING:  { label: 'Pendente',   className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  ACTIVE:   { label: 'Ativo',      className: 'bg-green-100 text-green-800 border-green-200' },
  CANCELED: { label: 'Cancelado',  className: 'bg-red-100 text-red-800 border-red-200' },
  EXPIRED:  { label: 'Expirado',   className: 'bg-gray-100 text-gray-600 border-gray-200' },
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-4 mb-6">
          <BackLink href="/admin" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">Gestão de Imobiliárias</h1>
              <p className="text-gray-500">Gerencie as imobiliárias cadastradas na plataforma.</p>
            </div>

            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => setIsSheetOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Nova Imobiliária
            </Button>
          </div>
        </div>

        <div className="rounded-md border bg-white py-3 px-4">
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
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex justify-center items-center gap-2 text-muted-foreground">
                      <Loader2 className="animate-spin h-4 w-4" />
                      Carregando...
                    </div>
                  </TableCell>
                </TableRow>
              ) : agencies && agencies.length > 0 ? (
                agencies.map((agency) => {
                  const sub      = agency.subscription
                  const hasDiscount = sub?.customPrice && sub.customPrice !== sub.snapshotPrice
                  const isToggling = toggleStatus.isPending && toggleStatus.variables === agency.id

                  return (
                    <TableRow key={agency.id} className={agency.active ? '' : 'opacity-60'}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{agency.name}</span>
                          {agency.customDomain ? (
                            <span className="text-xs text-muted-foreground">
                              {agency.customDomain}
                            </span>
                          ) : agency.slug ? (
                            <span className="text-xs text-muted-foreground">
                              {agency.slug}.{PLATFORM_DOMAIN}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">sem domínio</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {agency.cnpj ? formatCnpj(agency.cnpj) : '—'}
                      </TableCell>
                      <TableCell>
                        {sub ? (
                          sub.planName
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                            Sem plano
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {sub ? (
                          <div className="flex items-center gap-2">
                            <span>{formatCurrency(sub.effectivePrice)}</span>
                            {hasDiscount && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
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
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            <Badge className={subscriptionStatusConfig[sub.status].className}>
                              {subscriptionStatusConfig[sub.status].label}
                            </Badge>
                            {sub.manualBilling && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                Manual
                              </Badge>
                            )}
                          </div>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-3 text-xs text-muted-foreground">
                          <span title="Usuários">{agency.usage.users} usr</span>
                          <span title="Corretores">{agency.usage.realtors} cor</span>
                          <span title="Imóveis">{agency.usage.properties} imv</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={agency.active
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                        }>
                          {agency.active ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5"
                            onClick={() => setAgencyToEdit(agency)}
                            title="Editar imobiliária"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {getBackofficeUrl(agency) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5"
                              asChild
                              title="Acessar backoffice"
                            >
                              <a
                                href={getBackofficeUrl(agency)!}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${
                              agency.active
                                ? 'text-red-400 hover:text-red-600 hover:bg-red-50'
                                : 'text-green-500 hover:text-green-700 hover:bg-green-50'
                            }`}
                            onClick={() => toggleStatus.mutate(agency.id)}
                            disabled={isToggling}
                            title={agency.active ? 'Desativar' : 'Ativar'}
                          >
                            {isToggling ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : agency.active ? (
                              <PowerOff className="h-4 w-4" />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Nenhuma imobiliária encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <AgencyOnboardingSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
        <AgencyEditSheet
          open={!!agencyToEdit}
          onOpenChange={(v) => !v && setAgencyToEdit(null)}
          agency={agencyToEdit}
        />
      </main>
    </div>
  )
}
