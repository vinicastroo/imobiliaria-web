"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Building2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const loginSchema = z.object({
  email:    z.string().min(1, 'Email é obrigatório').email('Formato de email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  /** Tenant logo URL from VisualConfig. Null = show platform fallback icon. */
  logoUrl:     string | null
  agencyName?: string | null
}

export function LoginForm({ logoUrl, agencyName }: LoginFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        redirect:  false,
        email:     data.email,
        password:  data.password,
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
      <div className="flex items-center justify-center py-12 lg:col-span-2 bg-white">
        <div className="mx-auto w-[350px] space-y-6">

          {/* Logo / fallback */}
          <div className="flex flex-col space-y-2 text-center items-center">
            <div className="relative w-40 h-20 mb-2 flex items-center justify-center">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={agencyName ?? 'Logo'}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-primary">
                  <Building2 size={40} strokeWidth={1.5} />
                  {agencyName && (
                    <span className="text-xs font-semibold tracking-wide uppercase opacity-70">
                      {agencyName}
                    </span>
                  )}
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">
              Acesso Administrativo
            </h1>
            <p className="text-sm text-muted-foreground">
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
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password.message}</span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 mt-4 h-11"
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
      <div className="hidden bg-muted lg:block lg:col-span-3 relative">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1470&auto=format&fit=crop"
          alt="Imagem de Imóvel de Alto Padrão"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay uses tenant primary color */}
        <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
        <div className="absolute bottom-10 left-10 z-20 text-white max-w-lg">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium">
              &ldquo;A tecnologia impulsionando o mercado imobiliário. Gerencie seus imóveis com eficiência e elegância.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

    </div>
  )
}
