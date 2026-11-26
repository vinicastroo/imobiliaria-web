'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Building2, Plus } from 'lucide-react'

import api from '@/services/api'

// Componentes UI
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdminPage, DataCard, PageHeader } from '@/components/admin/page'
import {
  EmptyState,
  RowActions,
  TableMessageRow,
  TableSkeletonRows,
} from '@/components/admin/states'
import { FeatureGate } from '@/components/feature-gate'

// Modais
import { EnterpriseDialog } from '@/components/enterprise-dialog'
import { DeleteEnterpriseDialog } from '@/components/delete-enterprise-dialog'

interface Enterprise {
  id: string
  name: string
  _count?: {
    properties: number
  }
}

export default function EmpreendimentosPage() {
  // --- Estados do Modal de Criação/Edição ---
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Enterprise | null>(null)

  // --- Estados do Modal de Exclusão ---
  const [deleteId, setDeleteId] = useState<string>('')
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Busca dados
  const { data: enterprises, isLoading } = useQuery<Enterprise[]>({
    queryKey: ['enterprises'],
    queryFn: async () => {
      const response = await api.get('/empreendimento')
      return response.data
    },
  })

  // Handlers
  const handleCreate = () => {
    setSelectedItem(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: Enterprise) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setIsDeleteOpen(true)
  }

  return (
    <FeatureGate feature="enterprises">
      <AdminPage>
        <PageHeader
          title="Empreendimentos"
          description="Lançamentos e prédios com várias unidades."
          actions={
            <Button onClick={handleCreate}>
              <Plus className="size-4" /> Novo empreendimento
            </Button>
          }
        />

        <DataCard
          toolbar={
            <p className="text-muted-foreground text-sm">
              {enterprises
                ? `${enterprises.length} ${enterprises.length === 1 ? 'empreendimento' : 'empreendimentos'}`
                : '\u00a0'}
            </p>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Nome</TableHead>
                <TableHead className="w-40">Imóveis vinculados</TableHead>
                <TableHead className="w-16 pr-4 text-right">
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeletonRows columns={3} />
              ) : enterprises && enterprises.length > 0 ? (
                enterprises.map((item) => {
                  const count = item._count?.properties ?? 0
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                            <Building2 className="size-4" />
                          </span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="bg-muted text-muted-foreground inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium tabular-nums">
                          {count} {count === 1 ? 'imóvel' : 'imóveis'}
                        </span>
                      </TableCell>
                      <TableCell className="pr-4 text-right">
                        <RowActions
                          label={item.name}
                          onEdit={() => handleEdit(item)}
                          onDelete={() => handleDelete(item.id)}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableMessageRow colSpan={3}>
                  <EmptyState
                    icon={Building2}
                    title="Nenhum empreendimento cadastrado"
                    description="Cadastre lançamentos e prédios para agrupar as unidades e ter uma página própria no site."
                    action={
                      <Button onClick={handleCreate}>
                        <Plus className="size-4" /> Novo empreendimento
                      </Button>
                    }
                  />
                </TableMessageRow>
              )}
            </TableBody>
          </Table>
        </DataCard>

        <EnterpriseDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          itemToEdit={selectedItem}
        />

        <DeleteEnterpriseDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} id={deleteId} />
      </AdminPage>
    </FeatureGate>
  )
}
