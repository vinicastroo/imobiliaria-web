"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2, AlertTriangle } from 'lucide-react'
import api from '@/services/api'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'

interface DeleteClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id: string
}

export function DeleteClientDialog({ open, onOpenChange, id }: DeleteClientDialogProps) {
  const queryClient = useQueryClient()

  const { mutate: deleteClient, isPending } = useMutation({
    mutationFn: async () => {
      await api.delete(`/clientes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente removido com sucesso')
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Erro ao remover cliente')
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Excluir Cliente?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá permanentemente os dados do cliente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => deleteClient()}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Confirmar Exclusão
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
