'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CreditCard } from 'lucide-react'

import api from '@/services/api'

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

import { PlanEditDialog } from './plan-edit-dialog'
import type { AdminPlan } from '@/types/admin'

function formatCurrency(value: string | number) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function PlansPage() {
  const [editPlan, setEditPlan] = useState<AdminPlan | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { data: plans, isLoading } = useQuery<AdminPlan[]>({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const response = await api.get('/admin/planos')
      return response.data
    },
  })

  const handleOpenEdit = (plan: AdminPlan) => {
    setEditPlan(plan)
    setIsEditOpen(true)
  }

  return (
    <AdminPage>
      <PageHeader title="Planos" description="Limites, preços e status dos planos da plataforma." />

      <DataCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Preço Padrão</TableHead>
              <TableHead className="text-center">Usuários</TableHead>
              <TableHead className="text-center">Corretores</TableHead>
              <TableHead className="text-center">Imóveis</TableHead>
              <TableHead className="text-center">Assinaturas</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonRows columns={8} rows={4} />
            ) : plans && plans.length > 0 ? (
              plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell className="tabular-nums">
                    {formatCurrency(plan.defaultPrice)}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">{plan.maxUsers}</TableCell>
                  <TableCell className="text-center tabular-nums">{plan.maxRealtors}</TableCell>
                  <TableCell className="text-center tabular-nums">{plan.maxProperties}</TableCell>
                  <TableCell className="text-center tabular-nums">
                    {plan._count.subscriptions}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={
                        plan.active
                          ? 'border-transparent bg-emerald-50 text-emerald-700'
                          : 'border-transparent bg-gray-100 text-gray-600'
                      }
                    >
                      {plan.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <RowActions label={plan.name} onEdit={() => handleOpenEdit(plan)} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableMessageRow colSpan={8}>
                <EmptyState
                  icon={CreditCard}
                  title="Nenhum plano cadastrado"
                  description="Os planos aparecem aqui assim que forem criados no banco."
                />
              </TableMessageRow>
            )}
          </TableBody>
        </Table>
      </DataCard>

      <PlanEditDialog open={isEditOpen} onOpenChange={setIsEditOpen} planToEdit={editPlan} />
    </AdminPage>
  )
}
