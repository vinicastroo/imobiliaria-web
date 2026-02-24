"use client"

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Upload, ImageIcon, ShieldAlert, Building2, CreditCard, Palette } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

import api from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BackLink } from '@/components/back-link'

const FONT_OPTIONS = ['Montserrat', 'Inter', 'Roboto', 'Lato', 'Poppins', 'Raleway', 'Open Sans']

interface AgencySettings {
  logo: string | null
  watermark: string | null
}

interface AgencyPlan {
  name: string
  features: string[]
  maxUsers: number
  maxRealtors: number
  maxProperties: number
}

interface AgencyInfo {
  name: string
  cnpj: string | null
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  plan: AgencyPlan | null
}

interface VisualConfigData {
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

const agencyInfoSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
})

type AgencyInfoFormData = z.infer<typeof agencyInfoSchema>

export default function ConfiguracoesPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const role = session?.user?.role

  const isAllowed = role === 'OWNER' || role === 'SUPER_ADMIN'

  const logoInputRef = useRef<HTMLInputElement>(null)
  const watermarkInputRef = useRef<HTMLInputElement>(null)
  const iconInputRef = useRef<HTMLInputElement>(null)

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null)
  const [watermarkPreview, setWatermarkPreview] = useState<string | null>(null)
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(null)

  const [primaryColor, setPrimaryColor] = useState('#0f172a')
  const [secondaryColor, setSecondaryColor] = useState('#e2e8f0')
  const [fontFamily, setFontFamily] = useState('Inter')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AgencyInfoFormData>({
    resolver: zodResolver(agencyInfoSchema),
    defaultValues: { name: '', cnpj: '', phone: '', email: '', address: '', city: '', state: '', zipCode: '' },
  })

  const { data: agencyInfo, isLoading: isLoadingInfo } = useQuery<AgencyInfo>({
    queryKey: ['agency-info'],
    queryFn: async () => (await api.get('/agency-info')).data,
    enabled: isAllowed,
  })

  const { data: settings, isLoading: isLoadingSettings } = useQuery<AgencySettings>({
    queryKey: ['agency-settings'],
    queryFn: async () => (await api.get('/agency-settings')).data,
    enabled: isAllowed,
  })

  const { data: visualConfig } = useQuery<VisualConfigData>({
    queryKey: ['visual-config'],
    queryFn: async () => (await api.get('/visual-config')).data,
    enabled: isAllowed,
  })

  useEffect(() => {
    if (agencyInfo) {
      reset({
        name: agencyInfo.name ?? '',
        cnpj: agencyInfo.cnpj ?? '',
        phone: agencyInfo.phone ?? '',
        email: agencyInfo.email ?? '',
        address: agencyInfo.address ?? '',
        city: agencyInfo.city ?? '',
        state: agencyInfo.state ?? '',
        zipCode: agencyInfo.zipCode ?? '',
      })
    }
  }, [agencyInfo, reset])

  useEffect(() => {
    if (visualConfig) {
      setPrimaryColor(visualConfig.primaryColor)
      setSecondaryColor(visualConfig.secondaryColor)
      setFontFamily(visualConfig.fontFamily)
    }
  }, [visualConfig])

  const infoMutation = useMutation({
    mutationFn: async (data: AgencyInfoFormData) => (await api.put('/agency-info', data)).data as AgencyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency-info'] })
      toast.success('Dados da imobiliária salvos com sucesso!')
    },
    onError: () => toast.error('Erro ao salvar dados da imobiliária.'),
  })

  const settingsMutation = useMutation({
    mutationFn: async (formData: FormData) =>
      (await api.put('/agency-settings', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data as AgencySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency-settings'] })
      setLogoFile(null)
      setLogoPreview(null)
      setWatermarkFile(null)
      setWatermarkPreview(null)
      toast.success('Identidade visual salva com sucesso!')
    },
    onError: () => toast.error('Erro ao salvar identidade visual.'),
  })

  const visualConfigMutation = useMutation({
    mutationFn: async () =>
      (await api.put('/visual-config', { primaryColor, secondaryColor, fontFamily })).data as VisualConfigData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visual-config'] })
      toast.success('Aparência do site salva com sucesso!')
    },
    onError: () => toast.error('Erro ao salvar aparência do site.'),
  })

  const iconMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('icon', file)
      return (await api.put('/visual-config/icon', formData, { headers: { 'Content-Type': 'multipart/form-data' } }))
        .data as { logoUrl: string }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visual-config'] })
      setIconFile(null)
      setIconPreview(null)
      toast.success('Ícone salvo com sucesso!')
    },
    onError: () => toast.error('Erro ao salvar ícone.'),
  })

  const handleFileSelect = (file: File, setFile: (f: File) => void, setPreview: (p: string) => void) => {
    setFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSaveSettings = () => {
    if (!logoFile && !watermarkFile) {
      toast.info('Nenhuma alteração para salvar.')
      return
    }
    const formData = new FormData()
    if (logoFile) formData.append('logo', logoFile)
    if (watermarkFile) formData.append('watermark', watermarkFile)
    settingsMutation.mutate(formData)
  }

  if (!isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4">
        <ShieldAlert className="h-16 w-16 text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-600">Acesso restrito</h2>
        <p className="text-sm text-gray-400">Apenas o proprietário da imobiliária pode acessar as configurações.</p>
      </div>
    )
  }

  if (isLoadingInfo || isLoadingSettings) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#17375F]" />
      </div>
    )
  }

  const currentLogo = logoPreview ?? settings?.logo ?? null
  const currentWatermark = watermarkPreview ?? settings?.watermark ?? null
  const currentIcon = iconPreview ?? visualConfig?.logoUrl ?? null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-8 gap-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col">
        <BackLink href="/admin/imoveis" />
        <h1 className="text-2xl font-bold text-[#17375F]">Configurações</h1>
        <p className="text-sm text-gray-500">
          Gerencie os dados, plano e identidade visual da sua imobiliária.
        </p>
      </div>

      <Tabs defaultValue="dados-gerais">
        <TabsList className="mb-4">
          <TabsTrigger value="dados-gerais">Dados Gerais</TabsTrigger>
          <TabsTrigger value="visual-do-site">Visual do Site</TabsTrigger>
        </TabsList>

        {/* ── Aba: Dados Gerais ─────────────────────────────────────────── */}
        <TabsContent value="dados-gerais" className="space-y-6">

          {/* Dados da Imobiliária */}
          <Card className="py-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#17375F]" />
                <CardTitle>Dados da Imobiliária</CardTitle>
              </div>
              <CardDescription>Informações cadastrais e de contato.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit((data) => infoMutation.mutate(data))} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input id="name" placeholder="Nome da imobiliária" {...register('name')} />
                    {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" placeholder="00.000.000/0000-00" {...register('cnpj')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(00) 00000-0000" {...register('phone')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="contato@imobiliaria.com" {...register('email')} />
                    {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" placeholder="Rua, número, complemento" {...register('address')} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" placeholder="Cidade" {...register('city')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" placeholder="UF" {...register('state')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input id="zipCode" placeholder="00000-000" {...register('zipCode')} />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="bg-[#17375F] hover:bg-[#122b4a]" disabled={infoMutation.isPending || !isDirty}>
                    {infoMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</> : 'Salvar dados'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Plano Atual */}
          {agencyInfo?.plan && (
            <Card className="py-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#17375F]" />
                  <CardTitle>Plano Atual</CardTitle>
                </div>
                <CardDescription>Detalhes do plano contratado.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <span className="text-lg font-semibold text-[#17375F]">{agencyInfo.plan.name}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                      <p className="text-sm text-gray-500">Usuários</p>
                      <p className="text-xl font-bold text-[#17375F]">
                        {agencyInfo.plan.maxUsers < 0 ? 'Sem limite' : agencyInfo.plan.maxUsers}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                      <p className="text-sm text-gray-500">Corretores</p>
                      <p className="text-xl font-bold text-[#17375F]">
                        {agencyInfo.plan.maxRealtors < 0 ? 'Sem limite' : agencyInfo.plan.maxRealtors}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                      <p className="text-sm text-gray-500">Imóveis</p>
                      <p className="text-xl font-bold text-[#17375F]">
                        {agencyInfo.plan.maxProperties < 0 ? 'Sem limite' : agencyInfo.plan.maxProperties}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Aba: Visual do Site ───────────────────────────────────────── */}
        <TabsContent value="visual-do-site" className="space-y-6">

          {/* Aparência */}
          <Card className="py-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-[#17375F]" />
                <CardTitle>Aparência</CardTitle>
              </div>
              <CardDescription>Ícone, cores e tipografia exibidos no site e no painel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Ícone do Painel */}
              <div className="space-y-2">
                <Label>Ícone do Painel</Label>
                <p className="text-xs text-gray-500">Exibido como logo na barra lateral do painel administrativo.</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden shrink-0">
                    {currentIcon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={currentIcon} alt="Ícone do painel" className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      ref={iconInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) { setIconFile(file); setIconPreview(URL.createObjectURL(file)) }
                      }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => iconInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      {currentIcon ? 'Trocar ícone' : 'Escolher ícone'}
                    </Button>
                    {iconFile && (
                      <Button
                        type="button"
                        size="sm"
                        className="bg-[#17375F] hover:bg-[#122b4a]"
                        disabled={iconMutation.isPending}
                        onClick={() => iconMutation.mutate(iconFile)}
                      >
                        {iconMutation.isPending
                          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
                          : 'Salvar ícone'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t" />

              {/* Cores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Cor Principal</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded border border-gray-200 p-0.5"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#000000"
                      className="font-mono"
                      maxLength={7}
                    />
                  </div>
                  <div className="h-8 w-full rounded-md border border-gray-100" style={{ backgroundColor: primaryColor }} />
                </div>

                <div className="space-y-2">
                  <Label>Cor Secundária</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded border border-gray-200 p-0.5"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      placeholder="#000000"
                      className="font-mono"
                      maxLength={7}
                    />
                  </div>
                  <div className="h-8 w-full rounded-md border border-gray-100" style={{ backgroundColor: secondaryColor }} />
                </div>
              </div>

              {/* Fonte */}
              <div className="space-y-2">
                <Label>Fonte</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue placeholder="Selecione uma fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font} value={font}>
                        <span style={{ fontFamily: font }}>{font}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Prévia */}
              <div className="rounded-lg border p-4 space-y-3 bg-gray-50">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Prévia</p>
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="h-9 px-5 rounded-full flex items-center text-white text-sm font-medium shadow-sm"
                    style={{ backgroundColor: primaryColor, fontFamily }}
                  >
                    Botão Principal
                  </div>
                  <div
                    className="h-9 px-5 rounded-full flex items-center text-white text-sm font-medium shadow-sm"
                    style={{ backgroundColor: secondaryColor, fontFamily }}
                  >
                    Botão Secundário
                  </div>
                </div>
                <p className="text-sm text-gray-600" style={{ fontFamily }}>
                  Texto de exemplo com a fonte <strong>{fontFamily}</strong>.
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-[#17375F] hover:bg-[#122b4a]"
                  onClick={() => visualConfigMutation.mutate()}
                  disabled={visualConfigMutation.isPending}
                >
                  {visualConfigMutation.isPending
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
                    : 'Salvar aparência'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Identidade Visual */}
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Identidade Visual</CardTitle>
              <CardDescription>Logo e marca d&apos;água da sua imobiliária.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Logo da Imobiliária</p>
                    <p className="text-xs text-gray-500">Usada no painel e materiais da imobiliária.</p>
                  </div>
                  <div className="flex items-center justify-center w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden">
                    {currentLogo ? (
                      <Image src={currentLogo} alt="Logo" width={300} height={150} className="object-contain max-h-full" unoptimized />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <ImageIcon className="h-12 w-12" />
                        <span className="text-sm">Nenhuma logo definida</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f, setLogoFile, setLogoPreview) }}
                  />
                  <Button type="button" variant="outline" className="w-full" onClick={() => logoInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    {currentLogo ? 'Trocar logo' : 'Escolher logo'}
                  </Button>
                  {logoFile && <p className="text-xs text-green-600">Selecionado: {logoFile.name}</p>}
                </div>

                {/* Marca d'água */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Marca d&apos;água</p>
                    <p className="text-xs text-gray-500">Aplicada sobre as fotos dos imóveis.</p>
                  </div>
                  <div className="relative flex items-center justify-center w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-100 to-gray-300" />
                    {currentWatermark ? (
                      <Image src={currentWatermark} alt="Marca d'água" width={300} height={150} className="object-contain max-h-full relative" unoptimized />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400 relative">
                        <ImageIcon className="h-12 w-12" />
                        <span className="text-sm">Nenhuma marca d&apos;água definida</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={watermarkInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f, setWatermarkFile, setWatermarkPreview) }}
                  />
                  <Button type="button" variant="outline" className="w-full" onClick={() => watermarkInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    {currentWatermark ? "Trocar marca d'água" : "Escolher marca d'água"}
                  </Button>
                  {watermarkFile && <p className="text-xs text-green-600">Selecionado: {watermarkFile.name}</p>}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-[#17375F] hover:bg-[#122b4a]"
                  onClick={handleSaveSettings}
                  disabled={settingsMutation.isPending || (!logoFile && !watermarkFile)}
                >
                  {settingsMutation.isPending
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
                    : 'Salvar identidade visual'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
