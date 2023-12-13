/* eslint-disable no-undef */
import api from '@/services/api'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { useCallback } from 'react'
interface PropsModal {
  open: boolean
  handleClose: () => void
}

type FormValues = {
  description: string
}

const registerFormSchema = z.object({
  description: z.string(),
  // .refine((val) => !Number.isNaN(parseInt(val, 10)), {
  //   message: 'Expected number, received a string',
  // })
})

export function ModalCreateType({ open, handleClose }: PropsModal) {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(registerFormSchema),
  })

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (data: any) => {
      try {
        await api.post('/tipo-imovel', data).then(() => {
          resetField('description')
          toast.success('Tipo imovel criado com sucesso !')
          handleClose()
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error)
        toast.error('Ocorreu um erro na api')
      }
    },
    [handleClose, resetField],
  )

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Criar tipo imóvel</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Digite o tipo do imóvel"
            label="Tipo imóvel"
            sx={{ my: 1 }}
            error={!!errors.description}
            helperText={errors.description ? errors.description.message : ''}
            {...register('description')}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">Finalizar</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
