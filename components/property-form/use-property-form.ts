"use client"

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { toast } from 'sonner'

import api from '@/services/api'
import { useCepLookup } from '@/hooks/use-cep-lookup'
import { propertySchema, type PropertyFormData } from './property-schema'
import type { ImageItem, PropertyData } from './types'

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
}

function mapPropertyToFormData(d: PropertyData, isEdit: boolean): PropertyFormData {
  const formValues: PropertyFormData = {
    name: d.name,
    slug: d.slug,
    value: d.value,
    summary: d.summary,
    type_id: d.type_property?.id ?? '',
    description: d.description,
    bedrooms: d.bedrooms,
    bathrooms: d.bathrooms,
    suites: d.suites,
    parkingSpots: d.parkingSpots,
    totalArea: d.totalArea,
    privateArea: d.privateArea,
    cep: d.cep,
    state: d.state,
    city: d.city,
    neighborhood: d.neighborhood,
    street: d.street,
    number: d.numberAddress,
    latitude: d.latitude,
    longitude: d.longitude,
    enterpriseId: d.enterprise?.id ?? '',
    realtorIds: d.realtors?.length > 0 ? d.realtors.map((r) => r.id) : [],
  }

  if (isEdit) {
    const isNum = !isNaN(Number(d.code))
    formValues.code = isNum ? Number(d.code) : d.code
  }

  return formValues
}

interface UsePropertyFormOptions {
  mode: 'create' | 'edit'
  propertyId?: string
  defaultValues?: PropertyData
}

export function usePropertyForm({ mode, propertyId, defaultValues }: UsePropertyFormOptions) {
  const router = useRouter()
  const [images, setImages] = useState<ImageItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEdit = mode === 'edit'

  const formValues = useMemo(
    () => defaultValues ? mapPropertyToFormData(defaultValues, isEdit) : undefined,
    [defaultValues, isEdit],
  )

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema) as Resolver<PropertyFormData>,
    defaultValues: {
      type_id: '',
      enterpriseId: '',
      realtorIds: [],
      bedrooms: '0',
      bathrooms: '0',
      suites: '0',
      parkingSpots: '0',
      totalArea: '0',
      privateArea: '0',
    },
    values: formValues,
    resetOptions: { keepDirtyValues: true },
  })

  const { setValue, watch } = form

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'min-h-[200px] w-full bg-transparent px-3 py-2 text-sm focus-visible:outline-none',
      },
    },
    onUpdate({ editor: ed }) {
      setValue('description', ed.getHTML())
    },
  })

  // Auto-generate slug from name (only in create mode)
  const name = watch('name')
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isEdit && isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    isFirstRender.current = false
    if (name) {
      setValue('slug', generateSlug(name))
    }
  }, [name, setValue, isEdit])

  // CEP lookup
  const cep = watch('cep')
  const { setInitialCep } = useCepLookup(cep ?? '', (data) => {
    setValue('city', data.city)
    setValue('neighborhood', data.neighborhood)
    setValue('state', data.state)
    setValue('street', data.street)
    if (data.latitude) setValue('latitude', data.latitude)
    if (data.longitude) setValue('longitude', data.longitude)
  })

  // Sync CEP lookup, editor and images when defaultValues arrive
  useEffect(() => {
    if (!defaultValues) return

    setInitialCep(defaultValues.cep)

    const existingImages: ImageItem[] = defaultValues.files.map((f) => ({
      type: 'existing' as const,
      id: f.id,
      path: f.path,
      fileName: f.fileName,
      thumb: f.thumb,
    }))
    existingImages.sort((a, b) => {
      if (a.type === 'existing' && b.type === 'existing') {
        return (b.thumb ? 1 : 0) - (a.thumb ? 1 : 0)
      }
      return 0
    })
    setImages(existingImages)
  }, [defaultValues, setInitialCep])

  // Sync editor content when defaultValues arrive
  useEffect(() => {
    if (editor && defaultValues?.description) {
      editor.commands.setContent(defaultValues.description)
    }
  }, [editor, defaultValues?.description])

  // Image actions for existing images
  const handleDeleteExisting = async (fileName: string) => {
    try {
      await api.post('/files/delete-images', { fileName })
      toast.success('Imagem removida com sucesso')
    } catch {
      toast.error('Erro ao remover imagem')
      throw new Error('Failed to delete image')
    }
  }

  const handleSetThumb = async (fileId: string) => {
    if (!propertyId || !defaultValues) return
    try {
      await api.post(`/imovel/update-thumb/${fileId}`, {
        property_id: defaultValues.id,
      })
      toast.success('Capa atualizada com sucesso')
    } catch {
      toast.error('Erro ao atualizar capa')
    }
  }

  // Submit
  const onSubmit = async (data: PropertyFormData) => {
    if (mode === 'create' && images.length === 0) {
      toast.error('Adicione pelo menos uma imagem na aba "Imagens"')
      return
    }

    setIsSubmitting(true)
    try {
      // Upload new images
      const newImages = images.filter(
        (img): img is Extract<ImageItem, { type: 'new' }> => img.type === 'new',
      )

      let paths: { path: string; fileName: string }[] = []
      if (newImages.length > 0) {
        paths = await Promise.all(
          newImages.map(async (img) => {
            const formData = new FormData()
            formData.append('files', img.file)
            const res = await api.post('/files/upload', formData)
            return {
              path: res.data.paths[0]?.path || res.data.paths[0],
              fileName: res.data.paths[0]?.fileName || img.file.name,
            }
          }),
        )
      }

      if (mode === 'create') {
        await api.post('/imovel', { ...data, files: paths })
        toast.success('Imóvel criado com sucesso!')
      } else {
        await api.put(`/imovel/${propertyId}`, { ...data, files: paths })
        toast.success('Imóvel atualizado com sucesso!')
      }

      router.push('/admin/imoveis')
    } catch (error) {
      console.error(error)
      toast.error(
        mode === 'create' ? 'Erro ao criar imóvel' : 'Erro ao atualizar imóvel',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    editor,
    images,
    setImages,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    handleDeleteExisting: isEdit ? handleDeleteExisting : undefined,
    handleSetThumb: isEdit ? handleSetThumb : undefined,
  }
}
