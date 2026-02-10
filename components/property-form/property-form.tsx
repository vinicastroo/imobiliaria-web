"use client"

import { Controller } from 'react-hook-form'
import { EditorContent } from '@tiptap/react'
import { NumericFormat } from 'react-number-format'
import {
  Bed,
  Bath,
  CarFront,
  Ruler,
  Loader2,
  Image as ImageIcon,
  FileText,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BackLink } from '@/components/back-link'
import { MenuBarTiptap } from '@/components/menu-bar-tip-tap'
import { RealtorSorter } from '@/components/realtor-sorter'

import { usePropertyOptions } from '@/hooks/use-property-options'
import { usePropertyForm } from './use-property-form'
import { ImageUploader } from './image-uploader'
import type { PropertyData } from './types'

interface PropertyFormProps {
  mode: 'create' | 'edit'
  propertyId?: string
  defaultValues?: PropertyData
}

export function PropertyForm({ mode, propertyId, defaultValues }: PropertyFormProps) {
  const { types, realtors, enterprises } = usePropertyOptions()

  const {
    form,
    editor,
    images,
    setImages,
    isSubmitting,
    onSubmit,
    handleDeleteExisting,
    handleSetThumb,
  } = usePropertyForm({ mode, propertyId, defaultValues })

  const {
    register,
    control,
    formState: { errors },
  } = form

  const isEdit = mode === 'edit'
  const title = isEdit ? 'Editar Imóvel' : 'Criar Novo Imóvel'
  const submitLabel = isEdit ? 'Salvar Alterações' : 'Salvar Imóvel'

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <BackLink href="/admin/imoveis" />
          <h1 className="text-2xl font-bold text-[#17375F]">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {isEdit && defaultValues?.slug && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              asChild
            >
              <Link
                href={`/imoveis/${defaultValues.slug}`}
                target="_blank"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver no site
              </Link>
            </Button>
          )}

          <Button
            type="submit"
            className="bg-[#17375F] hover:bg-[#122b4a]"
            size="lg"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-3">
            <TabsTrigger value="geral" className="gap-2">
              <FileText size={16} /> Dados Gerais
            </TabsTrigger>
            <TabsTrigger value="imagens" className="gap-2">
              <ImageIcon size={16} /> Imagens
            </TabsTrigger>
          </TabsList>

          {/* ===== DADOS GERAIS ===== */}
          <TabsContent value="geral">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* COLUNA ESQUERDA */}
              <div className="md:col-span-2 space-y-6">
                <Card className="py-6">
                  <CardHeader>
                    <CardTitle>Informações do Imóvel</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nome do Imóvel</Label>
                      <Input
                        {...register('name')}
                        placeholder="Ex: Apartamento Vista Mar"
                      />
                      {errors.name && (
                        <span className="text-xs text-red-500">
                          {errors.name.message}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {isEdit && (
                        <div className="space-y-2">
                          <Label>Código do Imóvel</Label>
                          <Input
                            {...register('code' as 'name')}
                            placeholder="Ex: APV123"
                            disabled={
                              typeof defaultValues?.code === 'number'
                            }
                            className={
                              typeof defaultValues?.code === 'number'
                                ? 'bg-gray-100 font-bold'
                                : ''
                            }
                          />
                          {'code' in errors && errors.code && (
                            <span className="text-xs text-red-500">
                              {errors.code.message}
                            </span>
                          )}
                        </div>
                      )}
                      <div
                        className={`space-y-2 ${isEdit ? '' : 'col-span-2'}`}
                      >
                        <Label>Slug (URL)</Label>
                        <Input {...register('slug')} />
                        {errors.slug && (
                          <span className="text-xs text-red-500">
                            {errors.slug.message}
                          </span>
                        )}
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
                              onValueChange={(v) => onChange(v.formattedValue)}
                              prefix="R$ "
                              thousandSeparator="."
                              decimalSeparator=","
                              customInput={Input}
                              placeholder="R$ 0,00"
                            />
                          )}
                        />
                        {errors.value && (
                          <span className="text-xs text-red-500">
                            {errors.value.message}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Controller
                          name="type_id"
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {types.map((t) => (
                                  <SelectItem key={t.id} value={t.id}>
                                    {t.description}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.type_id && (
                          <span className="text-xs text-red-500">
                            {errors.type_id.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Empreendimento{' '}
                        <span className="text-xs">(Opcional)</span>
                      </Label>
                      <Controller
                        name="enterpriseId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione um empreendimento" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none_value">
                                -- Nenhum --
                              </SelectItem>
                              {enterprises.map((ent) => (
                                <SelectItem key={ent.id} value={ent.id}>
                                  {ent.name}
                                </SelectItem>
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
                      {errors.summary && (
                        <span className="text-xs text-red-500">
                          {errors.summary.message}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição Completa</Label>
                      <div
                        className={`border rounded-md ${
                          errors.description
                            ? 'border-red-500'
                            : 'border-gray-200'
                        } bg-white overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2`}
                      >
                        <MenuBarTiptap editor={editor} />
                        <EditorContent editor={editor} />
                      </div>
                      {errors.description && (
                        <span className="text-xs text-red-500">
                          {errors.description.message}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Corretores */}
                <Card className="py-6">
                  <CardHeader>
                    <CardTitle>Corretores Responsáveis</CardTitle>
                    <p className="text-sm text-gray-500">
                      Selecione quem está atendendo este imóvel
                    </p>
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
                <Card className="py-6">
                  <CardHeader>
                    <CardTitle>Características</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="flex items-center gap-1">
                        <Bed size={14} /> Quartos
                      </Label>
                      <Input type="number" {...register('bedrooms')} />
                    </div>
                    <div className="space-y-1">
                      <Label className="flex items-center gap-1">
                        <Bath size={14} /> Banheiros
                      </Label>
                      <Input type="number" {...register('bathrooms')} />
                    </div>
                    <div className="space-y-1">
                      <Label className="flex items-center gap-1">
                        <Bath size={14} /> Suítes
                      </Label>
                      <Input type="number" {...register('suites')} />
                    </div>
                    <div className="space-y-1">
                      <Label className="flex items-center gap-1">
                        <CarFront size={14} /> Vagas
                      </Label>
                      <Input type="number" {...register('parkingSpots')} />
                    </div>
                    <div className="space-y-1">
                      <Label className="flex items-center gap-1">
                        <Ruler size={14} /> Área Total
                      </Label>
                      <Input type="number" {...register('totalArea')} />
                    </div>
                    <div className="space-y-1">
                      <Label className="flex items-center gap-1">
                        <Ruler size={14} /> Área Priv.
                      </Label>
                      <Input type="number" {...register('privateArea')} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="py-4">
                  <CardHeader>
                    <CardTitle>Localização</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>CEP</Label>
                      <Input {...register('cep')} placeholder="00000-000" />
                      {errors.cep && (
                        <span className="text-xs text-red-500">
                          {errors.cep.message}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 space-y-2">
                        <Label>Cidade</Label>
                        <Input {...register('city')} />
                      </div>
                      <div className="space-y-2">
                        <Label>UF</Label>
                        <Input {...register('state')} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Bairro</Label>
                      <Input {...register('neighborhood')} />
                    </div>
                    <div className="space-y-2">
                      <Label>Rua</Label>
                      <Input {...register('street')} />
                    </div>
                    <div className="space-y-2">
                      <Label>Número</Label>
                      <Input {...register('number')} />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Latitude</Label>
                        <Input {...register('latitude')} />
                      </div>
                      <div className="space-y-2">
                        <Label>Longitude</Label>
                        <Input {...register('longitude')} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ===== IMAGENS ===== */}
          <TabsContent value="imagens">
            <Card className="py-6">
              <CardHeader>
                <CardTitle>Galeria de Imagens</CardTitle>
                <p className="text-sm text-gray-500">
                  Faça o upload das fotos do imóvel aqui. Arraste para
                  reordenar.
                </p>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  images={images}
                  onImagesChange={setImages}
                  onDeleteExisting={handleDeleteExisting}
                  onSetThumb={handleSetThumb}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </>
  )
}
