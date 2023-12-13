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

export function ModalDeleteProperty({ id, open, handleClose }: PropsModal) {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({})

  const handleDeleteProperty = useCallback(async () => {
    try {
      await api.delete(`/imovel/${id}`).then((response) => {
        if (response) {
          toast.success('Imóvel excluído com sucesso!')
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
      <DialogTitle>Excluir imóvel</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Você realmente deseja excluir este imóvel?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          disabled={isSubmitting}
          onClick={handleSubmit(handleDeleteProperty)}
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  )
}
