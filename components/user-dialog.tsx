"use client"

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import api from '@/services/api'

// Schema de validação
const userSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional().or(z.literal('')),
  role: z.enum(['OWNER', 'MANAGER', 'REALTOR']),
  realtorId: z.string().optional(),
  // Campos do corretor (aparecem quando role === 'REALTOR')
  creci: z.string().optional(),
  phone: z.string().optional(),
})

type UserFormData = z.infer<typeof userSchema>

export interface User {
  id: string
  name: string
  email: string
  role: 'OWNER' | 'MANAGER' | 'REALTOR'
  createdAt: string
  realtorProfile?: {
    id: string
    name: string
    creci: string
  } | null
}

interface Realtor {
  id: string
  name: string
  creci: string
}

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userToEdit?: User | null
}

// Payload para criar usuário
interface CreateUserPayload {
  name: string
  email: string
  password?: string
  role: 'OWNER' | 'MANAGER' | 'REALTOR'
  createRealtor?: boolean
  creci?: string
  phone?: string
}

// Tipo para erros da API
interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

export function UserDialog({ open, onOpenChange, userToEdit }: UserDialogProps) {
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)
  const isEditing = !!userToEdit

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'REALTOR',
      realtorId: '',
      creci: '',
      phone: '',
    },
  })

  const selectedRole = watch('role')

  // Busca corretores disponíveis
  const { data: availableRealtors } = useQuery<Realtor[]>({
    queryKey: ['realtors-available'],
    queryFn: async () => {
      const response = await api.get('/usuarios/realtors-available')
      return response.data
    },
    enabled: open,
  })

  // Busca todos os corretores para edição (inclui o já vinculado)
  const { data: allRealtors } = useQuery<Realtor[]>({
    queryKey: ['realtors'],
    queryFn: async () => {
      const response = await api.get('/corretor')
      return response.data
    },
    enabled: open && isEditing,
  })

  // Preenche o formulário ao editar
  useEffect(() => {
    if (userToEdit) {
      reset({
        name: userToEdit.name,
        email: userToEdit.email,
        password: '', // Senha vazia na edição
        role: userToEdit.role,
        realtorId: userToEdit.realtorProfile?.id || 'none',
        creci: '',
        phone: '',
      })
    } else {
      reset({
        name: '',
        email: '',
        password: '',
        role: 'REALTOR',
        realtorId: 'none',
        creci: '',
        phone: '',
      })
    }
  }, [userToEdit, reset, open])

  // Mutation para criar
  const createMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const payload: CreateUserPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }

      // Se o perfil é CORRETOR, cria também o registro de corretor
      if (data.role === 'REALTOR') {
        payload.createRealtor = true
        payload.creci = data.creci
        payload.phone = data.phone
      }

      const response = await api.post<User>('/usuarios', payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['realtors-available'] })
      queryClient.invalidateQueries({ queryKey: ['realtors'] })
      toast.success('Usuário criado com sucesso!')
      onOpenChange(false)
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Erro ao criar usuário')
    },
  })

  // Mutation para atualizar
  const updateMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const payload = {
        ...data,
        password: data.password || undefined, // Não envia se vazio
        realtorId: data.realtorId === 'none' ? null : data.realtorId,
      }
      const response = await api.put(`/usuarios/${userToEdit?.id}`, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['realtors-available'] })
      toast.success('Usuário atualizado com sucesso!')
      onOpenChange(false)
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar usuário')
    },
  })

  const onSubmit = (data: UserFormData) => {
    if (isEditing) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  // Lista de corretores para o select
  const realtorsForSelect = isEditing
    ? allRealtors || []
    : availableRealtors || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as informações do usuário.'
              : 'Preencha os dados para criar um novo usuário.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Nome completo"
              {...register('name')}
            />
            {errors.name && (
              <span className="text-xs text-red-500">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email.message}</span>
            )}
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Senha {isEditing && <span className="text-xs text-gray-400">(deixe vazio para manter)</span>}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={isEditing ? '••••••••' : 'Mínimo 6 caracteres'}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500">{errors.password.message}</span>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Perfil</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNER">Proprietário</SelectItem>
                    <SelectItem value="MANAGER">Gerente</SelectItem>
                    <SelectItem value="REALTOR">Corretor</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Campos do corretor - aparecem quando perfil é CORRETOR e está criando */}
          {!isEditing && selectedRole === 'REALTOR' && (
            <div className="space-y-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <p className="text-sm text-[#17375F] font-medium">
                Dados do Corretor
              </p>
              <p className="text-xs text-gray-500">
                Será criado automaticamente um perfil de corretor vinculado a este usuário.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creci">CRECI</Label>
                  <Input
                    id="creci"
                    placeholder="Ex: 12345-SC"
                    {...register('creci')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(47) 99999-9999"
                    {...register('phone')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Se estiver EDITANDO: select para vincular a corretor existente */}
          {isEditing && (
            <div className="space-y-2">
              <Label>Vincular a Corretor <span className="text-xs text-gray-400">(opcional)</span></Label>
              <Controller
                name="realtorId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || 'none'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um corretor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Nenhum --</SelectItem>
                      {realtorsForSelect.map((realtor) => (
                        <SelectItem key={realtor.id} value={realtor.id}>
                          {realtor.name} ({realtor.creci})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-gray-400">
                Vincule este usuário a um perfil de corretor existente.
              </p>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#17375F] hover:bg-[#122b4a]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : isEditing ? (
                'Salvar Alterações'
              ) : (
                'Criar Usuário'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
