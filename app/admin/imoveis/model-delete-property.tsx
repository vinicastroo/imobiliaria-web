"use client"

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { AxiosError } from 'axios'
import api from '@/services/api'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface PropsModal {
  open: boolean
  handleClose: () => void
  id: string
}

export function ModalDeleteProperty({ id, open, handleClose }: PropsModal) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteProperty = async () => {
    try {
      setIsDeleting(true)
      await api.delete(`/imovel/${id}`)

      toast.success('Imóvel excluído com sucesso!')

      // Fecha o modal
      handleClose()

    } catch (error: unknown) {
      console.error(error)
      const errorMessage = (error as AxiosError<{ message: string }>).response?.data?.message || 'Erro ao excluir imóvel'
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir imóvel</AlertDialogTitle>
          <AlertDialogDescription>
            Você realmente deseja excluir este imóvel? Essa ação não pode ser desfeita e removerá permanentemente os dados do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={handleDeleteProperty}
            disabled={isDeleting}
          >
            {isDeleting ? (
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