"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, UploadCloud } from 'lucide-react'
import Image from 'next/image'

import api from '@/services/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"

// Interface para tipagem
export interface Realtor {
  id: string
  name: string
  creci: string
  phone: string
  avatar?: string
}

const realtorSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  creci: z.string().min(1, 'CRECI é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  avatar: z.string().optional(),
})

type RealtorSchema = z.infer<typeof realtorSchema>

interface RealtorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  realtorToEdit?: Realtor | null
}

export function RealtorDialog({ open, onOpenChange, realtorToEdit }: RealtorDialogProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<RealtorSchema>({
    resolver: zodResolver(realtorSchema)
  })

  // Efeito para preencher o formulário quando abrir em modo edição
  useEffect(() => {
    if (open) {
      if (realtorToEdit) {
        setValue('name', realtorToEdit.name)
        setValue('creci', realtorToEdit.creci)
        setValue('phone', realtorToEdit.phone)
        setValue('avatar', realtorToEdit.avatar)
        setAvatarPreview(realtorToEdit.avatar || null)
      } else {
        reset({
          name: '',
          creci: '',
          phone: '',
          avatar: ''
        })
        setAvatarPreview(null)
      }
    }
  }, [open, realtorToEdit, setValue, reset])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    setUploading(true)
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('files', file)

    try {
      const res = await api.post('/files/upload', formData)
      // Ajuste conforme o retorno exato da sua API (path ou url)
      const path = res.data.paths[0]?.path || res.data.paths[0]
      setValue('avatar', path)
      setAvatarPreview(path)
    } catch (err) {
      toast.error('Erro ao fazer upload da foto')
    } finally {
      setUploading(false)
    }
  }

  const mutation = useMutation({
    mutationFn: async (data: RealtorSchema) => {
      if (realtorToEdit) {
        // EDITAR (PUT)
        await api.put(`/corretor/${realtorToEdit.id}`, data)
      } else {
        // CRIAR (POST)
        await api.post('/corretor', data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['realtors'] })
      toast.success(realtorToEdit ? 'Corretor atualizado!' : 'Corretor cadastrado!')
      onOpenChange(false)
    },
    onError: () => toast.error('Erro ao salvar')
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{realtorToEdit ? 'Editar Corretor' : 'Cadastrar Corretor'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">

          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Avatar" fill className="object-cover" />
              ) : (
                <UploadCloud className="text-gray-400" />
              )}
            </div>
            <Label htmlFor="avatar-upload" className="cursor-pointer text-sm text-blue-600 hover:underline">
              {uploading ? 'Enviando...' : 'Alterar foto'}
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </div>

          <div className="space-y-2">
            <Label>Nome</Label>
            <Input {...register('name')} placeholder="Nome completo" />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CRECI</Label>
              <Input {...register('creci')} placeholder="Ex: 12345-F" />
              {errors.creci && <span className="text-red-500 text-xs">{errors.creci.message}</span>}
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input {...register('phone')} placeholder="Ex: 5547999999999" />
              {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[#17375F]" disabled={mutation.isPending || uploading}>
              {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}