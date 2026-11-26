'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Layers, Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

import api from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AdminPage, DataCard, PageHeader } from '@/components/admin/page'
import {
  EmptyState,
  RowActions,
  TableMessageRow,
  TableSkeletonRows,
} from '@/components/admin/states'

interface Infrastructure {
  id: string
  name: string
  createdAt: string
}

export default function InfraestruturaPage() {
  const queryClient = useQueryClient()
  const [newName, setNewName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: items, isLoading } = useQuery<Infrastructure[]>({
    queryKey: ['infrastructures'],
    queryFn: async () => {
      const res = await api.get('/infraestrutura')
      return res.data
    },
  })

  async function handleAdd() {
    const name = newName.trim()
    if (!name) return

    setIsAdding(true)
    try {
      await api.post('/infraestrutura', { name })
      setNewName('')
      await queryClient.invalidateQueries({ queryKey: ['infrastructures'] })
      toast.success('Item adicionado com sucesso!')
    } catch {
      toast.error('Erro ao adicionar item')
    } finally {
      setIsAdding(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      await api.delete(`/infraestrutura/${deleteId}`)
      await queryClient.invalidateQueries({ queryKey: ['infrastructures'] })
      toast.success('Item removido com sucesso!')
    } catch {
      toast.error('Erro ao remover item')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <AdminPage>
      <PageHeader
        title="Infraestrutura"
        description="Itens de infraestrutura disponíveis para os imóveis (piscina, churrasqueira, portaria…)."
      />

      <DataCard
        toolbar={
          <>
            <form
              className="flex w-full gap-2 sm:max-w-md"
              onSubmit={(e) => {
                e.preventDefault()
                handleAdd()
              }}
            >
              <Input
                aria-label="Nome do novo item"
                placeholder="Novo item (ex.: Piscina, Churrasqueira)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Button
                type="submit"
                disabled={isAdding || !newName.trim()}
                className="w-28 shrink-0"
              >
                {isAdding ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                Adicionar
              </Button>
            </form>
            <p className="text-muted-foreground text-sm">
              {items ? `${items.length} ${items.length === 1 ? 'item' : 'itens'}` : '\u00a0'}
            </p>
          </>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Nome</TableHead>
              <TableHead className="w-16 pr-4 text-right">
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonRows columns={2} />
            ) : items && items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-4 font-medium">{item.name}</TableCell>
                  <TableCell className="pr-4 text-right">
                    <RowActions label={item.name} onDelete={() => setDeleteId(item.id)} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableMessageRow colSpan={2}>
                <EmptyState
                  icon={Layers}
                  title="Nenhum item cadastrado"
                  description="Adicione o primeiro item no campo acima. Ele fica disponível em todos os imóveis."
                />
              </TableMessageRow>
            )}
          </TableBody>
        </Table>
      </DataCard>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover item de infraestrutura?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O item será removido de todos os imóveis que o
              utilizam.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPage>
  )
}
