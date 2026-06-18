"use client"

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react'

import api from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z
  .object({
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error('Token de redefinição inválido.')
      return
    }
    try {
      await api.post('/password/reset', { token, password: data.password })
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Token inválido ou expirado.'
      toast.error(message)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-[380px] space-y-4 text-center">
          <h1 className="text-xl font-bold text-red-600">Link inválido</h1>
          <p className="text-sm text-muted-foreground">
            Este link de redefinição de senha é inválido ou expirou.
          </p>
          <Link href="/login/forgot-password" className="text-sm text-primary hover:underline">
            Solicitar novo link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[380px] space-y-6">

        {success ? (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-primary">Senha redefinida!</h1>
            <p className="text-sm text-muted-foreground">
              Sua senha foi atualizada com sucesso. Você será redirecionado para o login em instantes.
            </p>
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Ir para o login agora
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-bold text-primary">Nova senha</h1>
              <p className="text-sm text-muted-foreground">
                Escolha uma nova senha para a sua conta.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    {...register('password')}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs text-red-500">{errors.password.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repita a nova senha"
                    {...register('confirmPassword')}
                    className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                    aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>
                )}
              </div>

              <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Redefinir senha'
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
