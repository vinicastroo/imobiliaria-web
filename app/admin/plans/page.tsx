"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Pencil } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-4 mb-6">
          <BackLink href="/admin" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#17375F]">Gestão de Planos</h1>
              <p className="text-gray-500">Visualize e edite os planos da plataforma.</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border bg-white py-3 px-4">
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
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex justify-center items-center gap-2 text-muted-foreground">
                      <Loader2 className="animate-spin h-4 w-4" />
                      Carregando...
                    </div>
                  </TableCell>
                </TableRow>
              ) : plans && plans.length > 0 ? (
                plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{formatCurrency(plan.defaultPrice)}</TableCell>
                    <TableCell className="text-center">{plan.maxUsers}</TableCell>
                    <TableCell className="text-center">{plan.maxRealtors}</TableCell>
                    <TableCell className="text-center">{plan.maxProperties}</TableCell>
                    <TableCell className="text-center">{plan._count.subscriptions}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          plan.active
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }
                      >
                        {plan.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-900 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleOpenEdit(plan)}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Nenhum plano encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <PlanEditDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          planToEdit={editPlan}
        />
      </main>
    </div>
  )
}
