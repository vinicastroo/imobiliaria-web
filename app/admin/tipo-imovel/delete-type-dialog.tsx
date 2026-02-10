"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

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
import { Button } from "@/components/ui/button"

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

interface ModalDeleteTypeProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id: string
}

export function DeleteTypeDialog({ id, open, onOpenChange }: ModalDeleteTypeProps) {
  const queryClient = useQueryClient()

  const { mutate: deleteType, isPending } = useMutation({
    mutationFn: async () => {
      await api.delete(`/tipo-imovel/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-types'] })
      toast.success('Tipo imóvel excluído com sucesso!')
      onOpenChange(false) // Fecha o modal
    },
    onError: (error: unknown) => {
      console.error(error)

      const apiError = error as ApiError
      const message = apiError?.response?.data?.message || 'Ocorreu um erro ao excluir.'

      toast.error(message)
    }
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir tipo imóvel</AlertDialogTitle>
          <AlertDialogDescription>
            Você realmente deseja excluir este tipo de imóvel? Essa ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={() => deleteType()}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}