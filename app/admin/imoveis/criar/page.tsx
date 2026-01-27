"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { NumericFormat } from 'react-number-format'
import { Bed, Bath, CarFront, Ruler, Loader2, Image as ImageIcon, FileText } from 'lucide-react'

// --- TIPTAP (Editor) ---
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
// Ajuste o import conforme o nome do seu componente (usei o mesmo do Editar)
import { MenuBarTiptap } from '@/components/menu-bar-tip-tap'

import type { FilePondFile } from 'filepond'

// UI Components (Shadcn)
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BackLink } from '@/components/back-link'
import { MultiFileInput } from '@/components/multi-file-input'
import { RealtorSorter } from '@/components/realtor-sorter'

import api from '@/services/api'
import brasilAPi from '@/services/brasilAPi'

// Schema Zod (Sem o campo 'code', pois é autoincrement)
const createSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  // code: Removido, o banco gera automático
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

export default function CriarImovelPage() {
  const router = useRouter()
  const [types, setTypes] = useState<TypeProperty[]>([])
  const [realtors, setRealtors] = useState<Realtor[]>([])
  const [files, setFiles] = useState<FilePondFile[]>([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [enterprises, setEnterprises] = useState<{ id: string, name: string }[]>([])

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
      realtorIds: [],
      bedrooms: "0",
      bathrooms: "0",
      suites: "0",
      parkingSpots: "0",
      totalArea: "0",
      privateArea: "0"
    }
  })

  useEffect(() => {
    api.get('/tipo-imovel').then((res) => setTypes(res.data))
    api.get('/corretor').then((res) => setRealtors(res.data))
    api.get('/empreendimento').then(res => setEnterprises(res.data))
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm max-w-none',
      },
    },
    immediatelyRender: false,
    onUpdate({ editor }) {
      setValue('description', editor.getHTML())
    },
  })

  // Gera Slug automaticamente
  const name = watch('name')
  useEffect(() => {
    if (name) {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug)
    }
  }, [name, setValue])

  // Busca CEP
  const cep = watch('cep')
  useEffect(() => {
    if (cep && cep.length >= 8) {
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
  }, [cep, setValue])

  const onSubmit = async (data: SchemaQuestion) => {
    if (files.length === 0) {
      toast.error('Adicione pelo menos uma imagem na aba "Imagens"')
      return
    }

    setIsSubmitting(true)
    try {
      // Upload das imagens
      const paths = await Promise.all(
        files.map(async (fileItem) => {
          const formData = new FormData()
          formData.append('files', fileItem.file as Blob)
          const res = await api.post('/files/upload', formData)
          // Garante estrutura correta
          return {
            path: res.data.paths[0]?.path || res.data.paths[0],
            fileName: res.data.paths[0]?.fileName || fileItem.file.name
          }
        })
      )

      // Envia para API (sem o campo code, o backend gera)
      await api.post('/imovel', { ...data, files: paths })

      toast.success('Imóvel criado com sucesso!')
      router.push('/admin/imoveis')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao criar imóvel')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full mx-auto p-4 md:p-8 max-w-[1400px]">

        <div className='flex items-center justify-between mb-3'>
          <div className="flex flex-col">
            <BackLink href="/admin/imoveis" />
            <h1 className="text-2xl font-bold text-[#17375F]">Criar Novo Imóvel</h1>
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
              'Salvar Imóvel'
            )}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-3">
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
                        {/* REMOVIDO O CAMPO CÓDIGO 
                           Motivo: Banco gera automaticamente (1000, 1001...) 
                        */}
                        <div className="space-y-2 col-span-2">
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
                        <div className={`border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-200'} bg-white overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2`}>
                          <MenuBarTiptap editor={editor} />
                          <EditorContent editor={editor} />
                        </div>
                        {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
                      </div>

                    </CardContent>
                  </Card>

                  {/* Card Corretores (Com Sorter) */}
                  <Card className='py-6'>
                    <CardHeader>
                      <CardTitle>Corretores Responsáveis</CardTitle>
                      <p className="text-sm text-gray-500">Selecione quem está atendendo este imóvel</p>
                    </CardHeader>
                    <CardContent>
                      <Controller
                        name="realtorIds"
                        control={control}
                        render={({ field }) => (
                          <RealtorSorter
                            allRealtors={realtors}
                            selectedIds={field.value || []}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* COLUNA DIREITA */}
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
                      <div className="space-y-2">
                        <Label>CEP</Label>
                        <Input {...register('cep')} placeholder="00000-000" />
                        {errors.cep && <span className="text-xs text-red-500">{errors.cep.message}</span>}
                      </div>
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

            <TabsContent value="imagens">
              <Card className='py-6'>
                <CardHeader>
                  <CardTitle>Galeria de Imagens</CardTitle>
                  <p className="text-sm text-gray-500">
                    Faça o upload das fotos do imóvel aqui. Arraste para reordenar.
                  </p>
                </CardHeader>
                <CardContent>
                  <MultiFileInput
                    files={files}
                    onUpdateFiles={setFiles}
                  />
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </form>
      </main>
    </div>
  )
}