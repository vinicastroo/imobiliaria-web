import api from '@/services/api'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import { useCallback } from 'react'

interface PropsModal {
  open: boolean
  handleClose: () => void
  id: string
}

export function ModalDeleteType({ id, open, handleClose }: PropsModal) {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({})

  const handleDeletePromotion = useCallback(async () => {
    try {
      await api.delete(`/tipo-imovel/${id}`).then((response) => {
        if (response) {
          toast.success('Tipo imóvel excluído com sucesso!')
          handleClose()
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data.message)
    }
  }, [handleClose, id])

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Excluir tipo imóvel</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Você realmente deseja excluir este tipo de imóvel?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          disabled={isSubmitting}
          onClick={handleSubmit(handleDeletePromotion)}
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  )
}
