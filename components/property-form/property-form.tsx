'use client'

import { useEffect } from 'react'
import { EditorContent } from '@tiptap/react'
import { NumericFormat } from 'react-number-format'
import { Bed, Bath, CarFront, Ruler, Loader2, ExternalLink, Check, X } from 'lucide-react'
import { motion } from 'motion/react'
import { DURATION, EASE } from '@/components/motion'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormSection, PageHeader } from '@/components/admin/page'
import { MenuBarTiptap } from '@/components/menu-bar-tip-tap'
import { RealtorSorter } from '@/components/realtor-sorter'
import { Skeleton } from '@/components/ui/skeleton'

import { useSession } from 'next-auth/react'
import { usePropertyOptions } from '@/hooks/use-property-options'
import { useWatermark } from '@/hooks/use-watermark'
import { useInfrastructures } from '@/hooks/use-infrastructures'
import { usePropertyForm } from './use-property-form'
import { ImageUploader } from './image-uploader'
import { InfrastructurePicker } from './infrastructure-picker'
import type { PropertyData } from './types'

interface PropertyFormProps {
  mode: 'create' | 'edit'
  propertyId?: string
  defaultValues?: PropertyData
}

export function PropertyForm({ mode, propertyId, defaultValues }: PropertyFormProps) {
  const { data: session } = useSession()
  const { watermarkUrl } = useWatermark()
  const isRealtor = session?.user?.role === 'REALTOR'
  const realtorProfileId = session?.user?.realtorProfileId
  const { types, realtors, enterprises, isLoading: isLoadingOptions } = usePropertyOptions()
  const { infrastructures, isLoading: isLoadingInfrastructures } = useInfrastructures()

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
    setValue,
    watch,
    formState: { errors },
  } = form

  // Auto-atribui o corretor logado quando é REALTOR
  useEffect(() => {
    if (isRealtor && realtorProfileId && mode === 'create') {
      form.setValue('realtorIds', [realtorProfileId])
    }
  }, [isRealtor, realtorProfileId, mode, form])

  const isEdit = mode === 'edit'
  const title = isEdit ? 'Editar imóvel' : 'Novo imóvel'
  const isDirty = form.formState.isDirty

  const fieldError = (msg?: string) =>
    msg ? <span className="text-destructive text-xs">{msg}</span> : null

  return (
    <>
      <PageHeader
        breadcrumb={[{ href: '/admin/imoveis', label: 'Imóveis' }, { label: title }]}
        title={isEdit && defaultValues?.name ? defaultValues.name : title}
        description={
          isEdit
            ? 'Atualize as informações, fotos e corretores deste imóvel.'
            : 'Preencha as informações e as fotos. Você pode salvar e continuar depois.'
        }
        actions={
          isEdit && defaultValues?.slug ? (
            <Button type="button" variant="outline" asChild>
              <Link href={`/imoveis/${defaultValues.slug}`} target="_blank">
                <ExternalLink className="size-4" />
                Ver no site
              </Link>
            </Button>
          ) : undefined
        }
      />

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Coluna principal ─────────────────────────────────────── */}
          <div className="space-y-6 lg:col-span-2">
            <FormSection
              id="informacoes"
              title="Informações"
              description="Nome, endereço da página e tipo do imóvel."
            >
              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="pf-name">Nome do imóvel</Label>
                  <Input
                    id="pf-name"
                    {...register('name')}
                    placeholder="Ex.: Apartamento com vista para o mar"
                  />
                  {fieldError(errors.name?.message)}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {isEdit && (
                    <div className="space-y-2">
                      <Label htmlFor="pf-code">Código</Label>
                      <Input
                        id="pf-code"
                        {...register('code' as 'name')}
                        placeholder="Ex.: APV123"
                        disabled={typeof defaultValues?.code === 'number'}
                        className={
                          typeof defaultValues?.code === 'number'
                            ? 'bg-muted font-semibold tabular-nums'
                            : ''
                        }
                      />
                      {'code' in errors && fieldError(errors.code?.message)}
                    </div>
                  )}
                  <div className={`space-y-2 ${isEdit ? '' : 'sm:col-span-2'}`}>
                    <Label htmlFor="pf-slug">Endereço da página (slug)</Label>
                    <Input id="pf-slug" {...register('slug')} maxLength={80} />
                    <div className="flex items-center justify-between">
                      {fieldError(errors.slug?.message) ?? <span />}
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {(watch('slug') ?? '').length}/80
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    {isLoadingOptions ? (
                      <Skeleton className="h-9 w-full" />
                    ) : (
                      <Select
                        onValueChange={(val) => setValue('type_id', val, { shouldDirty: true })}
                        value={watch('type_id') || undefined}
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
                    {fieldError(errors.type_id?.message)}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Empreendimento{' '}
                      <span className="text-muted-foreground font-normal">(opcional)</span>
                    </Label>
                    <Select
                      onValueChange={(val) =>
                        setValue('enterpriseId', val === 'none_value' ? '' : val, {
                          shouldDirty: true,
                        })
                      }
                      value={watch('enterpriseId') || undefined}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Nenhum" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none_value">Nenhum</SelectItem>
                        {enterprises.map((ent) => (
                          <SelectItem key={ent.id} value={ent.id}>
                            {ent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </FormSection>

            <FormSection
              id="valores"
              title="Valores e negociação"
              description="Como o preço aparece no site."
            >
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      Valor
                      {watch('priceOnRequest') && (
                        <span className="text-muted-foreground ml-2 text-xs font-normal">
                          (exibido como &quot;Sob consulta&quot;)
                        </span>
                      )}
                    </Label>
                    <div className="flex items-center gap-2">
                      <NumericFormat
                        value={watch('value')}
                        onValueChange={(v) =>
                          setValue('value', v.formattedValue, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        prefix="R$ "
                        thousandSeparator="."
                        decimalSeparator=","
                        customInput={Input}
                        placeholder="R$ 0,00"
                        className="tabular-nums"
                      />
                      {watch('transactionType') === 'ALUGUEL' && (
                        <span className="text-muted-foreground text-sm whitespace-nowrap">
                          /mês
                        </span>
                      )}
                    </div>
                    {fieldError(errors.value?.message)}
                  </div>

                  <div className="space-y-2">
                    <Label>Negociação</Label>
                    <Select
                      onValueChange={(val) =>
                        setValue('transactionType', val as 'VENDA' | 'ALUGUEL', {
                          shouldDirty: true,
                        })
                      }
                      value={watch('transactionType')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VENDA">Venda</SelectItem>
                        <SelectItem value="ALUGUEL">Aluguel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="divide-border/70 divide-y rounded-lg border">
                  <SwitchRow
                    id="priceOnRequest"
                    checked={watch('priceOnRequest')}
                    onChange={(v) => setValue('priceOnRequest', v, { shouldDirty: true })}
                    title="Exibir como “Sob consulta”"
                    description="O valor fica escondido no site."
                  />
                  <SwitchRow
                    id="pricePrefix"
                    checked={watch('pricePrefix')}
                    onChange={(v) => setValue('pricePrefix', v, { shouldDirty: true })}
                    disabled={watch('priceOnRequest')}
                    title="Mostrar “a partir de” antes do valor"
                    description="Útil para lançamentos com várias unidades."
                  />
                  <SwitchRow
                    id="highlighted"
                    checked={watch('highlighted')}
                    onChange={(v) => setValue('highlighted', v, { shouldDirty: true })}
                    title="Imóvel em destaque"
                    description="Aparece na página inicial do site."
                  />
                </div>
              </div>
            </FormSection>

            <FormSection
              id="descricao"
              title="Descrição"
              description="O resumo aparece nos cards; a descrição completa, na página do imóvel."
            >
              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="pf-summary">Resumo</Label>
                  <Textarea
                    id="pf-summary"
                    {...register('summary')}
                    maxLength={255}
                    placeholder="Breve descrição que aparece nos cards…"
                  />
                  {fieldError(errors.summary?.message)}
                </div>

                <div className="space-y-2">
                  <Label>Descrição completa</Label>
                  <div
                    className={`focus-within:ring-ring/50 overflow-hidden rounded-lg border bg-white focus-within:ring-[3px] ${
                      errors.description ? 'border-destructive' : 'border-input'
                    }`}
                  >
                    <MenuBarTiptap editor={editor} />
                    <EditorContent editor={editor} />
                  </div>
                  {fieldError(errors.description?.message)}
                </div>
              </div>
            </FormSection>

            <FormSection
              id="fotos"
              title="Fotos"
              description="Até 20 fotos. Arraste para reordenar e escolha a capa."
            >
              <div className="space-y-5">
                <div className="rounded-lg border">
                  <SwitchRow
                    id="applyWatermark"
                    checked={watch('applyWatermark')}
                    onChange={(v) => setValue('applyWatermark', v, { shouldDirty: true })}
                    title="Aplicar marca d’água nas fotos"
                    description={
                      watermarkUrl ? (
                        'A marca d’água da imobiliária é aplicada ao enviar.'
                      ) : (
                        <>
                          Você ainda não cadastrou a marca d’água.{' '}
                          <Link
                            href="/admin/configuracoes"
                            className="text-primary underline underline-offset-2 hover:opacity-80"
                          >
                            Configurar agora
                          </Link>
                        </>
                      )
                    }
                  />
                </div>

                <ImageUploader
                  images={images}
                  onImagesChange={setImages}
                  onDeleteExisting={handleDeleteExisting}
                  onSetThumb={handleSetThumb}
                  applyWatermark={watch('applyWatermark')}
                  watermarkUrl={watermarkUrl}
                />
              </div>
            </FormSection>

            {/* Corretores - esconde para REALTOR (auto-atribuído) */}
            {!isRealtor && (
              <FormSection
                id="corretores"
                title="Corretores responsáveis"
                description="Quem atende este imóvel. O primeiro aparece primeiro no site."
              >
                <RealtorSorter
                  allRealtors={realtors}
                  selectedIds={watch('realtorIds') || []}
                  onChange={(ids) => setValue('realtorIds', ids, { shouldDirty: true })}
                />
              </FormSection>
            )}

            <FormSection
              id="infraestrutura"
              title="Infraestrutura"
              description="Itens disponíveis no imóvel ou no condomínio."
            >
              {isLoadingInfrastructures ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded-full" />
                  ))}
                </div>
              ) : (
                <InfrastructurePicker
                  items={infrastructures}
                  selected={watch('infrastructureIds') ?? []}
                  onChange={(ids) => setValue('infrastructureIds', ids, { shouldDirty: true })}
                />
              )}
            </FormSection>
          </div>

          {/* ── Coluna lateral ───────────────────────────────────────── */}
          <div className="space-y-6">
            <FormSection id="caracteristicas" title="Características">
              <div className="grid grid-cols-2 gap-4">
                <NumberField
                  id="pf-bedrooms"
                  icon={Bed}
                  label="Quartos"
                  error={errors.bedrooms?.message}
                  input={<Input id="pf-bedrooms" type="number" min={0} {...register('bedrooms')} />}
                />
                <NumberField
                  id="pf-bathrooms"
                  icon={Bath}
                  label="Banheiros"
                  error={errors.bathrooms?.message}
                  input={
                    <Input id="pf-bathrooms" type="number" min={0} {...register('bathrooms')} />
                  }
                />
                <NumberField
                  id="pf-suites"
                  icon={Bath}
                  label="Suítes"
                  error={errors.suites?.message}
                  input={<Input id="pf-suites" type="number" min={0} {...register('suites')} />}
                />
                <NumberField
                  id="pf-parking"
                  icon={CarFront}
                  label="Vagas"
                  error={errors.parkingSpots?.message}
                  input={
                    <Input id="pf-parking" type="number" min={0} {...register('parkingSpots')} />
                  }
                />
                <NumberField
                  id="pf-total-area"
                  icon={Ruler}
                  label="Área total"
                  error={errors.totalArea?.message}
                  input={
                    <Input
                      id="pf-total-area"
                      type="number"
                      min={0}
                      placeholder="m²"
                      {...register('totalArea')}
                    />
                  }
                />
                <NumberField
                  id="pf-private-area"
                  icon={Ruler}
                  label="Área priv."
                  error={errors.privateArea?.message}
                  input={
                    <Input
                      id="pf-private-area"
                      type="number"
                      min={0}
                      placeholder="m²"
                      {...register('privateArea')}
                    />
                  }
                />
              </div>
            </FormSection>

            <FormSection id="localizacao" title="Localização">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pf-cep">CEP</Label>
                  <Input id="pf-cep" {...register('cep')} placeholder="00000-000" />
                  {fieldError(errors.cep?.message)}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="pf-city">Cidade</Label>
                    <Input id="pf-city" {...register('city')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pf-state">UF</Label>
                    <Input id="pf-state" {...register('state')} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pf-neighborhood">Bairro</Label>
                  <Input id="pf-neighborhood" {...register('neighborhood')} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="pf-street">Rua</Label>
                    <Input id="pf-street" {...register('street')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pf-number">Número</Label>
                    <Input id="pf-number" {...register('number')} />
                  </div>
                </div>
                <div className="border-border/70 grid grid-cols-2 gap-3 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="pf-lat">Latitude</Label>
                    <Input id="pf-lat" {...register('latitude')} className="tabular-nums" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pf-lng">Longitude</Label>
                    <Input id="pf-lng" {...register('longitude')} className="tabular-nums" />
                  </div>
                </div>
              </div>
            </FormSection>
          </div>
        </div>

        {/* ── Barra de ações flutuante (pílula centralizada) ─────────── */}
        <div className="pointer-events-none sticky bottom-6 z-30 mt-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.medium, ease: EASE, delay: 0.2 }}
            className="pointer-events-auto flex items-center gap-1 rounded-full border border-[var(--scala-border)] bg-white/95 p-1.5 shadow-[0_2px_4px_#0d111714,0_16px_40px_-8px_#0d111740] backdrop-blur"
          >
            <p
              className={`hidden items-center gap-2 pr-3 pl-3 text-sm sm:flex ${
                isDirty ? 'text-amber-700' : 'text-muted-foreground'
              }`}
              aria-live="polite"
            >
              <span
                className={`size-2 rounded-full ${isDirty ? 'bg-amber-500' : 'bg-emerald-500'}`}
                aria-hidden="true"
              />
              {isDirty ? 'Alterações não salvas' : isEdit ? 'Tudo salvo' : 'Novo imóvel'}
            </p>
            <span
              className="mx-1 hidden h-5 w-px bg-[var(--scala-border)] sm:block"
              aria-hidden="true"
            />
            <Button type="button" variant="ghost" className="h-9 rounded-full px-4" asChild>
              <Link href="/admin/imoveis">
                <X className="size-4" />
                Cancelar
              </Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 h-9 min-w-[124px] rounded-full px-5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Salvando…
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  Salvar
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </form>
    </>
  )
}

// ─── Peças locais do formulário ─────────────────────────────────────────────

function SwitchRow({
  id,
  checked,
  onChange,
  title,
  description,
  disabled,
}: {
  id: string
  checked: boolean
  onChange: (v: boolean) => void
  title: string
  description?: React.ReactNode
  disabled?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-4 py-3 ${
        disabled ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <div className="min-w-0">
        <Label htmlFor={id} className="cursor-pointer">
          {title}
        </Label>
        {description && <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  )
}

function NumberField({
  id,
  icon: Icon,
  label,
  error,
  input,
}: {
  id: string
  icon: React.ElementType
  label: string
  error?: string
  input: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-1.5">
        <Icon className="text-muted-foreground size-3.5" />
        {label}
      </Label>
      {input}
      {error && <span className="text-destructive text-xs">{error}</span>}
    </div>
  )
}
