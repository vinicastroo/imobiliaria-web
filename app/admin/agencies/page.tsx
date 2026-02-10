"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Plus } from 'lucide-react'

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
import type { AdminAgency } from '@/types/admin'

function formatCurrency(value: string | number) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatCnpj(cnpj: string) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

const statusConfig = {
  PENDING: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  ACTIVE: { label: 'Ativo', className: 'bg-green-100 text-green-800 border-green-200' },
  CANCELED: { label: 'Cancelado', className: 'bg-red-100 text-red-800 border-red-200' },
  EXPIRED: { label: 'Expirado', className: 'bg-gray-100 text-gray-600 border-gray-200' },
} as const

export default function AgenciesPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const { data: agencies, isLoading } = useQuery<AdminAgency[]>({
    queryKey: ['admin-agencies'],
    queryFn: async () => {
      const response = await api.get('/admin/agencies')
      return response.data
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-4 mb-6">
          <BackLink href="/admin" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#17375F]">Gestão de Imobiliárias</h1>
              <p className="text-gray-500">Gerencie as imobiliárias cadastradas na plataforma.</p>
            </div>

            <Button
              className="bg-[#17375F] hover:bg-[#122b4a]"
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
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Preço Efetivo</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Uso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center items-center gap-2 text-muted-foreground">
                      <Loader2 className="animate-spin h-4 w-4" />
                      Carregando...
                    </div>
                  </TableCell>
                </TableRow>
              ) : agencies && agencies.length > 0 ? (
                agencies.map((agency) => {
                  const sub = agency.subscription
                  const hasDiscount = sub?.customPrice && sub.customPrice !== sub.snapshotPrice

                  return (
                    <TableRow key={agency.id}>
                      <TableCell className="font-medium">{agency.name}</TableCell>
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
                          <Badge className={statusConfig[sub.status].className}>
                            {statusConfig[sub.status].label}
                          </Badge>
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
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhuma imobiliária encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <AgencyOnboardingSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      </main>
    </div>
  )
}
