"use client"

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, UploadCloud, ZoomIn, ZoomOut, Check, X } from 'lucide-react'
import Image from 'next/image'

// Import da lib de Crop
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '@/utils/cropImage' // Importe a função que criamos acima

import api from '@/services/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider" // Se tiver slider no shadcn, senão use input range
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"

// Interface e Schema (Mantidos iguais)
export interface Realtor {
  id: string
  name: string
  creci: string
  phone: string
  avatar?: string
}

interface CroppedArea {
  x: number
  y: number
  width: number
  height: number
}

interface CroppedAreaPixels {
  x: number
  y: number
  width: number
  height: number
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

  // --- Estados do Crop ---
  const [imageSrc, setImageSrc] = useState<string | null>(null) // Imagem original selecionada
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null)
  const [isCropping, setIsCropping] = useState(false)

  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<RealtorSchema>({
    resolver: zodResolver(realtorSchema)
  })

  useEffect(() => {
    if (open) {
      setImageSrc(null)
      setIsCropping(false)
      setZoom(1)

      if (realtorToEdit) {
        setValue('name', realtorToEdit.name)
        setValue('creci', realtorToEdit.creci)
        setValue('phone', realtorToEdit.phone)
        setValue('avatar', realtorToEdit.avatar)
        setAvatarPreview(realtorToEdit.avatar || null)
      } else {
        reset({ name: '', creci: '', phone: '', avatar: '' })
        setAvatarPreview(null)
      }
    }
  }, [open, realtorToEdit, setValue, reset])

  // 1. Ao selecionar arquivo: Ler como URL e abrir modo Crop
  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string)
        setIsCropping(true) // Ativa a tela de crop
      })
      reader.readAsDataURL(file)
    }
  }

  // 2. Callback do EasyCrop quando o usuário move a imagem
  const onCropComplete = useCallback((croppedArea: CroppedArea, croppedAreaPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  // 3. Confirmar Crop e Fazer Upload
  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    setUploading(true)
    try {
      // Gera o Blob recortado
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels)

      if (!croppedImageBlob) return

      // Prepara para enviar
      const formData = new FormData()
      // É importante dar um nome com extensão para o arquivo (ex: avatar.jpg)
      formData.append('files', croppedImageBlob, 'avatar-cropped.jpg')

      // Upload para API
      const res = await api.post('/files/upload', formData)
      const path = res.data.paths[0]?.path || res.data.paths[0]

      setValue('avatar', path)
      setAvatarPreview(path) // Mostra o preview final

      // Fecha modo crop
      setIsCropping(false)
      setImageSrc(null)
    } catch (e) {
      console.error(e)
      toast.error('Erro ao recortar/enviar imagem')
    } finally {
      setUploading(false)
    }
  }

  // Cancelar crop
  const handleCropCancel = () => {
    setIsCropping(false)
    setImageSrc(null)
  }

  const mutation = useMutation({
    mutationFn: async (data: RealtorSchema) => {
      if (realtorToEdit) {
        await api.put(`/corretor/${realtorToEdit.id}`, data)
      } else {
        await api.post('/corretor', data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['realtors'] })
      toast.success(realtorToEdit ? 'Atualizado!' : 'Cadastrado!')
      onOpenChange(false)
    },
    onError: () => toast.error('Erro ao salvar')
  })

  return (
    <Dialog open={open} onOpenChange={(val) => !isCropping && onOpenChange(val)}>
      <DialogContent className={isCropping ? "sm:max-w-[600px]" : ""}>
        <DialogHeader>
          <DialogTitle>
            {isCropping ? 'Ajustar Foto' : (realtorToEdit ? 'Editar Corretor' : 'Cadastrar Corretor')}
          </DialogTitle>
        </DialogHeader>

        {/* MODO CROP ATIVO */}
        {isCropping && imageSrc ? (
          <div className="flex flex-col gap-4">
            <div className="relative w-full h-[300px] bg-black rounded-md overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1} // Avatar redondo/quadrado = 1:1
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round" // Visualmente redondo para avatar
                showGrid={false}
              />
            </div>

            <div className="flex items-center gap-2 px-2">
              <ZoomOut size={16} />
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(val) => setZoom(val[0])}
                className="flex-1"
              />
              <ZoomIn size={16} />
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleCropCancel} disabled={uploading}>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button onClick={handleCropSave} className="bg-[#17375F]" disabled={uploading}>
                {uploading ? <Loader2 className="animate-spin mr-2" /> : <Check className="mr-2 h-4 w-4" />}
                Confirmar
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* MODO FORMULÁRIO NORMAL */
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
                Alterar foto
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onFileSelect} // Mudou aqui
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
              <Button type="submit" className="bg-[#17375F]" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}