"use client"

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Trash2, Plus } from 'lucide-react'
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
import { BackLink } from '@/components/back-link'

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-4 mb-6">
          <BackLink href="/admin" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#17375F]">Infraestrutura</h1>
              <p className="text-gray-500">
                Gerencie os itens de infraestrutura disponíveis para os imóveis.
              </p>
            </div>
          </div>
        </div>

        {/* Formulário de adição */}
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Nome do item (ex: Piscina, Churrasqueira...)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="max-w-sm bg-white"
          />
          <Button
            onClick={handleAdd}
            disabled={isAdding || !newName.trim()}
            className="bg-[#17375F] hover:bg-[#122b4a]"
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Adicionar
          </Button>
        </div>

        <div className="rounded-md border bg-white py-3 px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    <div className="flex justify-center items-center gap-2 text-muted-foreground">
                      <Loader2 className="animate-spin h-4 w-4" />
                      Carregando...
                    </div>
                  </TableCell>
                </TableRow>
              ) : items && items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {item.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteId(item.id)}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    Nenhum item cadastrado. Adicione o primeiro acima.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover item de infraestrutura?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O item será removido de todos os imóveis
                que o utilizam.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
