"use client"

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Upload, ImageIcon, ShieldAlert, Building2, CreditCard } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

import api from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { BackLink } from '@/components/back-link'

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

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null)
  const [watermarkPreview, setWatermarkPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AgencyInfoFormData>({
    resolver: zodResolver(agencyInfoSchema),
    defaultValues: {
      name: '',
      cnpj: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
  })

  const { data: agencyInfo, isLoading: isLoadingInfo } = useQuery<AgencyInfo>({
    queryKey: ['agency-info'],
    queryFn: async () => {
      const res = await api.get('/agency-info')
      return res.data
    },
    enabled: isAllowed,
  })

  const { data: settings, isLoading: isLoadingSettings } = useQuery<AgencySettings>({
    queryKey: ['agency-settings'],
    queryFn: async () => {
      const res = await api.get('/agency-settings')
      return res.data
    },
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

  const infoMutation = useMutation({
    mutationFn: async (data: AgencyInfoFormData) => {
      const res = await api.put('/agency-info', data)
      return res.data as AgencyInfo
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency-info'] })
      toast.success('Dados da imobiliária salvos com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao salvar dados da imobiliária.')
    },
  })

  const settingsMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.put('/agency-settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data as AgencySettings
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency-settings'] })
      setLogoFile(null)
      setLogoPreview(null)
      setWatermarkFile(null)
      setWatermarkPreview(null)
      toast.success('Identidade visual salva com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao salvar identidade visual.')
    },
  })

  const handleFileSelect = (
    file: File,
    setFile: (f: File) => void,
    setPreview: (p: string) => void,
  ) => {
    setFile(file)
    const url = URL.createObjectURL(file)
    setPreview(url)
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

  const onSubmitInfo = (data: AgencyInfoFormData) => {
    infoMutation.mutate(data)
  }

  if (!isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4">
        <ShieldAlert className="h-16 w-16 text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-600">Acesso restrito</h2>
        <p className="text-sm text-gray-400">
          Apenas o proprietário da imobiliária pode acessar as configurações.
        </p>
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-8 gap-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col">
        <BackLink href="/admin/imoveis" />
        <h1 className="text-2xl font-bold text-[#17375F]">Configurações</h1>
        <p className="text-sm text-gray-500">
          Gerencie os dados, plano e identidade visual da sua imobiliária.
        </p>
      </div>

      {/* Seção 1: Dados da Imobiliária */}
      <Card className="py-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#17375F]" />
            <CardTitle>Dados da Imobiliária</CardTitle>
          </div>
          <CardDescription>
            Informações cadastrais e de contato da sua imobiliária.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitInfo)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  placeholder="Nome da imobiliária"
                  {...register('name')}
                />
                {errors.name && (
                  <span className="text-xs text-red-500">{errors.name.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  {...register('cnpj')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  {...register('phone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contato@imobiliaria.com"
                  {...register('email')}
                />
                {errors.email && (
                  <span className="text-xs text-red-500">{errors.email.message}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Rua, número, complemento"
                {...register('address')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="Cidade"
                  {...register('city')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  placeholder="UF"
                  {...register('state')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  placeholder="00000-000"
                  {...register('zipCode')}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="bg-[#17375F] hover:bg-[#122b4a]"
                disabled={infoMutation.isPending || !isDirty}
              >
                {infoMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar dados'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Seção 2: Plano Atual */}
      {agencyInfo?.plan && (
        <Card className="py-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#17375F]" />
              <CardTitle>Plano Atual</CardTitle>
            </div>
            <CardDescription>
              Detalhes do plano contratado pela sua imobiliária.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-[#17375F]">
                  {agencyInfo.plan.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-500">Usuários</p>
                  <p className="text-xl font-bold text-[#17375F]">
                    {agencyInfo.plan.maxUsers}
                  </p>
                </div>
                <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-500">Corretores</p>
                  <p className="text-xl font-bold text-[#17375F]">
                    {agencyInfo.plan.maxRealtors}
                  </p>
                </div>
                <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-500">Imóveis</p>
                  <p className="text-xl font-bold text-[#17375F]">
                    {agencyInfo.plan.maxProperties}
                  </p>
                </div>
              </div>

              {/* {agencyInfo.plan.features.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Funcionalidades</p>
                  <div className="flex flex-wrap gap-2">
                    {agencyInfo.plan.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="bg-blue-50 text-[#17375F] border-blue-200"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seção 3: Identidade Visual */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#17375F]">Identidade Visual</h2>
            <p className="text-sm text-gray-500">
              Logo e marca d&apos;água da sua imobiliária.
            </p>
          </div>
          <Button
            className="bg-[#17375F] hover:bg-[#122b4a]"
            onClick={handleSaveSettings}
            disabled={settingsMutation.isPending || (!logoFile && !watermarkFile)}
          >
            {settingsMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar configurações'
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo */}
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Logo da Imobiliária</CardTitle>
              <CardDescription>
                Sua logo aparecerá no painel administrativo e materiais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden">
                {currentLogo ? (
                  <Image
                    src={currentLogo}
                    alt="Logo da imobiliária"
                    width={300}
                    height={150}
                    className="object-contain max-h-full"
                    unoptimized
                  />
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
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file, setLogoFile, setLogoPreview)
                }}
              />

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => logoInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {currentLogo ? 'Trocar logo' : 'Escolher logo'}
              </Button>

              {logoFile && (
                <p className="text-xs text-green-600">
                  Novo arquivo selecionado: {logoFile.name}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Marca d'água */}
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Marca d&apos;água</CardTitle>
              <CardDescription>
                Será aplicada sobre as fotos dos imóveis com baixa opacidade.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative flex items-center justify-center w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-100 to-gray-300" />

                {currentWatermark ? (
                  <Image
                    src={currentWatermark}
                    alt="Marca d'água"
                    width={300}
                    height={150}
                    className="object-contain max-h-full relative opacity-100"
                    unoptimized
                  />
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
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file, setWatermarkFile, setWatermarkPreview)
                }}
              />

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => watermarkInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {currentWatermark ? 'Trocar marca d\'água' : 'Escolher marca d\'água'}
              </Button>

              {watermarkFile && (
                <p className="text-xs text-green-600">
                  Novo arquivo selecionado: {watermarkFile.name}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
