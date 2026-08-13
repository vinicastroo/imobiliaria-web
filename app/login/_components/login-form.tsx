'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Building2, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Formato de email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  /** Tenant logo URL from VisualConfig. Null = show platform fallback icon. */
  logoUrl: string | null
  agencyName?: string | null
}

export function LoginForm({ logoUrl, agencyName }: LoginFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        toast.error('Email ou senha incorretos')
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        router.push('/admin')
        toast.success('Login realizado com sucesso')
      }
    } catch {
      toast.error('Ocorreu um erro inesperado')
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-5">
      {/* ── Left panel: form (2/5) ─────────────────────────────────────── */}
      <div className="flex items-center justify-center bg-white py-12 lg:col-span-2">
        <div className="mx-auto w-[350px] space-y-6">
          {/* Logo / fallback */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="relative mb-2 flex h-20 w-40 items-center justify-center">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={agencyName ?? 'Logo'}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="text-primary flex flex-col items-center gap-1">
                  <Building2 size={40} strokeWidth={1.5} />
                  {agencyName && (
                    <span className="text-xs font-semibold tracking-wide uppercase opacity-70">
                      {agencyName}
                    </span>
                  )}
                </div>
              )}
            </div>
            <h1 className="text-primary text-2xl font-bold tracking-tight">
              Acesso Administrativo
            </h1>
            <p className="text-muted-foreground text-sm">
              Entre com suas credenciais para continuar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@empresa.com.br"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  href="/login/forgot-password"
                  className="text-muted-foreground hover:text-primary text-xs hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••"
                  {...register('password')}
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
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

            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 mt-4 h-11 w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Acessar'
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* ── Right panel: background image (3/5) ───────────────────────── */}
      <div className="bg-muted relative hidden lg:col-span-3 lg:block">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1470&auto=format&fit=crop"
          alt="Imagem de Imóvel de Alto Padrão"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay uses tenant primary color */}
        <div className="bg-primary/60 absolute inset-0 mix-blend-multiply" />
        <div className="absolute bottom-10 left-10 z-20 max-w-lg text-white">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium">
              &ldquo;A tecnologia impulsionando o mercado imobiliário. Gerencie seus imóveis com
              eficiência e elegância.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
