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

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  id: string
}

export function DeleteEnterpriseDialog({ open, onOpenChange, id }: Props) {
  const queryClient = useQueryClient()

  const { mutate: deleteEnterprise, isPending } = useMutation({
    mutationFn: async () => {
      await api.delete(`/empreendimento/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprises'] })
      toast.success('Empreendimento removido com sucesso')
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Erro ao remover. Verifique se existem imóveis vinculados.')
    }
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Excluir Empreendimento?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá permanentemente o empreendimento.
            <br /><br />
            <strong>Nota:</strong> Se houver imóveis vinculados, eles perderão o vínculo, mas não serão excluídos (dependendo da sua regra de API).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => deleteEnterprise()}
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