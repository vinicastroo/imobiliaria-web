"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { NumericFormat } from 'react-number-format'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import {
  Bed, Bath, CarFront, Ruler, Loader2,
  Image as ImageIcon, FileText, Trash2, Star
} from 'lucide-react'
import Image from 'next/image'

import type { FilePondFile } from 'filepond'

// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BackLink } from '@/components/back-link'
import { MenuBarTiptap } from '@/components/menu-bar-tip-tap'
import { MultiFileInput } from '@/components/multi-file-input'
import { RealtorSorter } from '@/components/realtor-sorter' // <--- IMPORTANTE: Importe o componente que criamos

import api from '@/services/api'
import brasilAPi from '@/services/brasilAPi'

// Schema Zod (Mantido igual)
const createSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  code: z.number().min(1, 'Código é obrigatório'),
  value: z.string().min(1, 'Valor é obrigatório'),
  summary: z.string().min(1, 'Resumo é obrigatório'),
  type_id: z.string().min(1, 'Tipo do imóvel é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  bedrooms: z.string(),
  bathrooms: z.string(),
  suites: z.string(),
  parkingSpots: z.string(),
  totalArea: z.string(),
  privateArea: z.string(),
  cep: z.string().min(8, 'CEP inválido'),
  state: z.string().min(1, 'Estado é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().optional(),
  latitude: z.string().min(1, 'Latitude obrigatória'),
  longitude: z.string().min(1, 'Longitude obrigatória'),
  realtorIds: z.array(z.string()).optional(),
  enterpriseId: z.string().optional(),
})

type SchemaQuestion = z.infer<typeof createSchema>

interface TypeProperty {
  id: string
  description: string
}

interface Realtor {
  id: string
  name: string
  creci: string
  avatar?: string
}

interface Property {
  id: string
  name: string
  slug: string
  code: string
  summary: string
  description: string
  value: string
  bedrooms: string
  bathrooms: string
  parkingSpots: string
  suites: string
  totalArea: string
  privateArea: string
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  numberAddress: string
  longitude: string
  latitude: string
  type_property: {
    id: string
    description: string
  }
  files: {
    id: string
    path: string
    fileName: string
    thumb?: boolean
  }[]
  realtors: Realtor[] // Assumindo que a API já retorna ordenado
  enterprise?: {
    id: string
    name: string
  }
}

export default function EditarImovelPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [property, setProperty] = useState<Property | null>(null)
  const [types, setTypes] = useState<TypeProperty[]>([])
  const [allRealtors, setAllRealtors] = useState<Realtor[]>([])
  const [enterprises, setEnterprises] = useState<{ id: string, name: string }[]>([])

  const [newFiles, setNewFiles] = useState<FilePondFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SchemaQuestion>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      realtorIds: []
    }
  })

  // Configuração Tiptap
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setValue('description', editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm max-w-none',
      },
    },
  })

  // Carregar Dados Iniciais
  const loadProperty = useCallback(async () => {
    try {
      setLoadingData(true)
      const [typesRes, realtorsRes, propertyRes, enterprisesRes] = await Promise.all([
        api.get('/tipo-imovel'),
        api.get('/corretor'),
        api.get(`/imovel/${id}`),
        api.get('/empreendimento')
      ])

      setTypes(typesRes.data)
      setAllRealtors(realtorsRes.data)
      setEnterprises(enterprisesRes.data)

      const propData: Property = propertyRes.data
      setProperty(propData)

      // Preencher formulário
      setValue('name', propData.name)
      setValue('slug', propData.slug)
      setValue('code', Number(propData.code))
      setValue('value', propData.value)
      setValue('summary', propData.summary)
      setValue('type_id', propData.type_property.id)
      setValue('description', propData.description)
      setValue('bedrooms', propData.bedrooms)
      setValue('bathrooms', propData.bathrooms)
      setValue('suites', propData.suites)
      setValue('parkingSpots', propData.parkingSpots)
      setValue('totalArea', propData.totalArea)
      setValue('privateArea', propData.privateArea)
      setValue('cep', propData.cep)
      setValue('state', propData.state)
      setValue('city', propData.city)
      setValue('neighborhood', propData.neighborhood)
      setValue('street', propData.street)
      setValue('number', propData.numberAddress)
      setValue('latitude', propData.latitude)
      setValue('longitude', propData.longitude)
      setValue('enterpriseId', propData.enterprise?.id)

      // Preenche os corretores JÁ NA ORDEM QUE VIERAM DO BACKEND
      if (propData.realtors && propData.realtors.length > 0) {
        // Assume que a API já retorna ordenado pelo campo 'order' da tabela pivô
        setValue('realtorIds', propData.realtors.map(r => r.id))
      } else {
        setValue('realtorIds', [])
      }

      if (editor) {
        editor.commands.setContent(propData.description)
      }

    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar dados do imóvel")
      router.push('/admin/imoveis')
    } finally {
      setLoadingData(false)
    }
  }, [id, setValue, editor, router])

  useEffect(() => {
    if (id) {
      loadProperty()
    }
  }, [loadProperty, id])

  const handleDeleteImg = async (fileName: string) => {
    try {
      await api.post('/files/delete-images', { fileName })
      toast.success('Imagem removida com sucesso')
      loadProperty()
    } catch (e) {
      console.error(e)
      toast.error('Erro ao remover imagem')
    }
  }

  const handleEditThumb = async (fileId: string) => {
    if (!property) return
    try {
      await api.post(`/imovel/update-thumb/${fileId}`, { property_id: property.id })
      toast.success('Capa atualizada com sucesso')
      loadProperty()
    } catch (e) {
      console.error(e)
      toast.error('Erro ao atualizar capa')
    }
  }

  // Watchers
  const cep = watch('cep')
  useEffect(() => {
    if (cep && cep.length >= 8 && cep !== property?.cep) {
      brasilAPi.get(`/api/cep/v2/${cep}`).then((res) => {
        setValue('city', res.data.city)
        setValue('neighborhood', res.data.neighborhood)
        setValue('state', res.data.state)
        setValue('street', res.data.street)
        if (res.data.location?.coordinates) {
          setValue('latitude', res.data.location.coordinates.latitude)
          setValue('longitude', res.data.location.coordinates.longitude)
        }
      }).catch(() => toast.error('Erro ao buscar CEP'))
    }
  }, [cep, setValue, property])

  const onSubmit = async (data: SchemaQuestion) => {
    setIsSubmitting(true)
    try {
      let paths: { path: string, fileName: string }[] = []

      if (newFiles.length > 0) {
        paths = await Promise.all(
          newFiles.map(async (fileItem) => {
            const formData = new FormData()
            formData.append('files', fileItem.file as Blob)
            const res = await api.post('/files/upload', formData)
            return {
              path: res.data.paths[0].path, // Ajuste conforme retorno exato da sua API
              fileName: res.data.paths[0].fileName
            }
          })
        )
      }

      await api.put(`/imovel/${id}`, { ...data, files: paths })

      toast.success('Imóvel atualizado com sucesso!')
      router.push('/admin/imoveis')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao atualizar imóvel')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingData || !property) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#17375F]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full mx-auto p-4 md:p-8 max-w-[1400px]">

        <div className='flex items-center justify-between mb-6'>
          <div className="flex flex-col">
            <BackLink href="/admin/imoveis" />
            <h1 className="text-2xl font-bold text-[#17375F]">Editar Imóvel</h1>
          </div>

          <Button
            type="submit"
            className=" bg-[#17375F] hover:bg-[#122b4a]"
            size="lg"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
              <TabsTrigger value="geral" className="gap-2">
                <FileText size={16} /> Dados Gerais
              </TabsTrigger>
              <TabsTrigger value="imagens" className="gap-2">
                <ImageIcon size={16} /> Imagens
              </TabsTrigger>
            </TabsList>

            <TabsContent value="geral">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* COLUNA ESQUERDA */}
                <div className="md:col-span-2 space-y-6">
                  <Card className='py-6'>
                    <CardHeader><CardTitle>Informações do Imóvel</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <Label>Nome do Imóvel</Label>
                      <Input {...register('name')} placeholder="Ex: Apartamento Vista Mar" />
                      {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Código do Imóvel</Label>
                          <Input {...register('code')} placeholder="Ex: APV123" />
                          {errors.code && <span className="text-xs text-red-500">{errors.code.message}</span>}
                        </div>
                        <div className="space-y-2">
                          <Label>Slug (URL)</Label>
                          <Input {...register('slug')} />
                          {errors.slug && <span className="text-xs text-red-500">{errors.slug.message}</span>}
                        </div>
                      </div>


                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Valor</Label>
                          <Controller
                            name="value"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <NumericFormat
                                value={value}
                                onValueChange={(v) => onChange(v.value)}
                                prefix="R$ "
                                thousandSeparator="."
                                decimalSeparator=","
                                customInput={Input}
                                placeholder="R$ 0,00"
                              />
                            )}
                          />
                          {errors.value && <span className="text-xs text-red-500">{errors.value.message}</span>}
                        </div>

                        <div className="space-y-2">
                          <Label>Tipo</Label>
                          <Controller
                            name="type_id"
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  {types.map((t) => (
                                    <SelectItem key={t.id} value={t.id}>{t.description}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.type_id && <span className="text-xs text-red-500">{errors.type_id.message}</span>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Empreendimento <span className='text-xs'>(Opcional)</span></Label>
                        <Controller
                          name="enterpriseId"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || undefined}>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Selecione um empreendimento" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none_value">-- Nenhum --</SelectItem>
                                {enterprises.map((ent) => (
                                  <SelectItem key={ent.id} value={ent.id}>{ent.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Resumo</Label>
                        <Textarea
                          {...register('summary')}
                          maxLength={255}
                          placeholder="Breve descrição que aparece nos cards..."
                        />
                        {errors.summary && <span className="text-xs text-red-500">{errors.summary.message}</span>}
                      </div>

                      <div className="space-y-2">
                        <Label>Descrição Completa</Label>
                        <div className="border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                          <MenuBarTiptap editor={editor} />
                          <EditorContent editor={editor} />
                        </div>
                        {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
                      </div>
                    </CardContent>
                  </Card>

                  {/* --- CARD DE CORRETORES ATUALIZADO (Ordenável e com Foto) --- */}
                  <Card className='py-6'>
                    <CardHeader>
                      <CardTitle>Corretores Responsáveis</CardTitle>
                      <p className="text-sm text-gray-500">Selecione e ordene quem está atendendo este imóvel.</p>
                    </CardHeader>
                    <CardContent>
                      <Controller
                        name="realtorIds"
                        control={control}
                        render={({ field }) => (
                          <RealtorSorter
                            allRealtors={allRealtors}
                            selectedIds={field.value || []}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </CardContent>
                  </Card>

                </div>

                {/* COLUNA DIREITA (Mantida igual ao código anterior) */}
                <div className="md:col-span-1 space-y-6">
                  <Card className='py-6'>
                    <CardHeader><CardTitle>Características</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><Label className="flex items-center gap-1"><Bed size={14} /> Quartos</Label><Input type="number" {...register('bedrooms')} /></div>
                      <div className="space-y-1"><Label className="flex items-center gap-1"><Bath size={14} /> Banheiros</Label><Input type="number" {...register('bathrooms')} /></div>
                      <div className="space-y-1"><Label className="flex items-center gap-1"><Bath size={14} /> Suítes</Label><Input type="number" {...register('suites')} /></div>
                      <div className="space-y-1"><Label className="flex items-center gap-1"><CarFront size={14} /> Vagas</Label><Input type="number" {...register('parkingSpots')} /></div>
                      <div className="space-y-1"><Label className="flex items-center gap-1"><Ruler size={14} /> Área Total</Label><Input type="number" {...register('totalArea')} /></div>
                      <div className="space-y-1"><Label className="flex items-center gap-1"><Ruler size={14} /> Área Priv.</Label><Input type="number" {...register('privateArea')} /></div>
                    </CardContent>
                  </Card>

                  <Card className='py-4'>
                    <CardHeader><CardTitle>Localização</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2"><Label>CEP</Label><Input {...register('cep')} />{errors.cep && <span className="text-xs text-red-500">{errors.cep.message}</span>}</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 space-y-2"><Label>Cidade</Label><Input {...register('city')} /></div>
                        <div className="space-y-2"><Label>UF</Label><Input {...register('state')} /></div>
                      </div>
                      <div className="space-y-2"><Label>Bairro</Label><Input {...register('neighborhood')} /></div>
                      <div className="space-y-2"><Label>Rua</Label><Input {...register('street')} /></div>
                      <div className="space-y-2"><Label>Número</Label><Input {...register('number')} /></div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2"><Label>Latitude</Label><Input {...register('latitude')} /></div>
                        <div className="space-y-2"><Label>Longitude</Label><Input {...register('longitude')} /></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

              </div>
            </TabsContent>

            <TabsContent value="imagens" className="space-y-6">
              {property.files.length > 0 && (
                <Card className='py-6'>
                  <CardHeader><CardTitle>Imagens Existentes</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {property.files.map((file) => (
                        <div key={file.id} className="relative group aspect-square rounded-lg overflow-hidden border bg-gray-100">
                          <Image src={file.path} alt="Foto" fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button type="button" size="icon" variant="secondary" className="h-8 w-8 hover:bg-yellow-500" onClick={() => handleEditThumb(file.id)}>
                              <Star size={14} className={file.thumb ? "fill-current text-yellow-500" : ""} />
                            </Button>
                            <Button type="button" size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteImg(file.fileName)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                          {file.thumb && <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Capa</div>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className='py-6'>
                <CardHeader>
                  <CardTitle>Adicionar Novas Imagens</CardTitle>
                  <p className="text-sm text-gray-500">Arraste novas fotos aqui.</p>
                </CardHeader>
                <CardContent>
                  <MultiFileInput files={newFiles} onUpdateFiles={setNewFiles} />
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </form>
      </main>
    </div>
  )
}